const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const { cloudinary } = require('../config/cloudinary');

// Create property
exports.createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }

    let propertyData = { ...req.body };

    // Parse JSON string fields from form data
    if (typeof propertyData.address === 'string') {
      propertyData.address = JSON.parse(propertyData.address);
    }
    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = JSON.parse(propertyData.amenities);
    }
    if (typeof propertyData.monthlyExpenses === 'string') {
      propertyData.monthlyExpenses = JSON.parse(propertyData.monthlyExpenses);
    }
    if (typeof propertyData.oneTimeExpenses === 'string') {
      propertyData.oneTimeExpenses = JSON.parse(propertyData.oneTimeExpenses);
    }

    propertyData.owner = req.user._id;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        isCover: index === 0
      }));
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property listed successfully!',
      property
    });
  } catch (error) {
    // Clean up uploaded images on failure
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try { await cloudinary.uploader.destroy(file.filename); } catch (e) { /* ignore */ }
      }
    }
    next(error);
  }
};

// Get all properties (with search/filter/sort/pagination)
exports.getProperties = async (req, res, next) => {
  try {
    const {
      search, city, locality, pinCode, propertyType, roomType,
      minRent, maxRent, furnishing, amenities,
      availableFrom, sort, page = 1, limit = 12
    } = req.query;

    const filter = { status: 'active' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.locality': { $regex: search, $options: 'i' } }
      ];
    }
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (locality) filter['address.locality'] = { $regex: locality, $options: 'i' };
    if (pinCode) filter['address.pinCode'] = pinCode;
    if (propertyType) filter.propertyType = propertyType;
    if (roomType) filter.roomType = roomType;
    if (minRent || maxRent) {
      filter.monthlyRent = {};
      if (minRent) filter.monthlyRent.$gte = Number(minRent);
      if (maxRent) filter.monthlyRent.$lte = Number(maxRent);
    }
    if (furnishing) filter.furnishingStatus = furnishing;
    if (amenities) {
      const amenityList = amenities.split(',');
      filter.amenities = { $all: amenityList };
    }
    if (availableFrom) {
      filter.availableFrom = { $lte: new Date(availableFrom) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rent-low') sortOption = { monthlyRent: 1 };
    else if (sort === 'rent-high') sortOption = { monthlyRent: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner', 'name email phone profileImage')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean({ virtuals: true }),
      Property.countDocuments(filter)
    ]);

    res.json({
      success: true,
      properties,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single property
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone profileImage contactPreference');

    if (!property || property.status === 'removed') {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Increment view count
    property.viewCount += 1;
    await property.save();

    res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// Update property
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Ownership check
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit your own properties.' });
    }

    let updateData = { ...req.body };

    // Parse JSON string fields
    if (typeof updateData.address === 'string') updateData.address = JSON.parse(updateData.address);
    if (typeof updateData.amenities === 'string') updateData.amenities = JSON.parse(updateData.amenities);
    if (typeof updateData.monthlyExpenses === 'string') updateData.monthlyExpenses = JSON.parse(updateData.monthlyExpenses);
    if (typeof updateData.oneTimeExpenses === 'string') updateData.oneTimeExpenses = JSON.parse(updateData.oneTimeExpenses);

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        isCover: false
      }));

      let existingImages = property.images || [];
      if (typeof updateData.existingImages === 'string') {
        existingImages = JSON.parse(updateData.existingImages);
      }

      updateData.images = [...existingImages, ...newImages];
      if (updateData.images.length > 0 && !updateData.images.some(img => img.isCover)) {
        updateData.images[0].isCover = true;
      }
    }

    delete updateData.owner;
    delete updateData.existingImages;

    const updated = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email phone profileImage');

    res.json({
      success: true,
      message: 'Property updated successfully!',
      property: updated
    });
  } catch (error) {
    next(error);
  }
};

// Delete property
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own properties.' });
    }

    // Delete images from cloudinary
    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        try { await cloudinary.uploader.destroy(image.publicId); } catch (e) { /* ignore */ }
      }
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Get owner's properties
exports.getOwnerProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    res.json({ success: true, properties });
  } catch (error) {
    next(error);
  }
};
