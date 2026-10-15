const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// Create inquiry
exports.createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ success: false, message: 'Property ID and message are required.' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      owner: property.owner,
      student: req.user._id,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully!',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

// Get student's inquiries
exports.getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ student: req.user._id })
      .populate('property', 'title images monthlyRent address')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
};

// Get owner's inquiries
exports.getOwnerInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id })
      .populate('property', 'title images monthlyRent address')
      .populate('student', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, inquiries });
  } catch (error) {
    next(error);
  }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, ownerResponse } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }

    if (inquiry.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only manage inquiries for your own properties.' });
    }

    inquiry.status = status;
    if (ownerResponse) inquiry.ownerResponse = ownerResponse;
    await inquiry.save();

    res.json({ success: true, message: 'Inquiry updated.', inquiry });
  } catch (error) {
    next(error);
  }
};
