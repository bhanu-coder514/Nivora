const RoomRequirement = require('../models/RoomRequirement');
const Property = require('../models/Property');

// Create requirement
exports.createRequirement = async (req, res, next) => {
  try {
    const existing = await RoomRequirement.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have a room requirement. Please update it instead.'
      });
    }

    const requirement = await RoomRequirement.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Room requirement saved!',
      requirement
    });
  } catch (error) {
    next(error);
  }
};

// Get my requirements
exports.getMyRequirements = async (req, res, next) => {
  try {
    const requirements = await RoomRequirement.find({ user: req.user._id });
    res.json({ success: true, requirements });
  } catch (error) {
    next(error);
  }
};

// Update requirement
exports.updateRequirement = async (req, res, next) => {
  try {
    const requirement = await RoomRequirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found.' });
    }

    if (requirement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only update your own requirements.' });
    }

    const updated = await RoomRequirement.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    res.json({ success: true, message: 'Requirement updated.', requirement: updated });
  } catch (error) {
    next(error);
  }
};

// Delete requirement
exports.deleteRequirement = async (req, res, next) => {
  try {
    const requirement = await RoomRequirement.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({ success: false, message: 'Requirement not found.' });
    }

    if (requirement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own requirements.' });
    }

    await RoomRequirement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Requirement deleted.' });
  } catch (error) {
    next(error);
  }
};

// Get matching properties
exports.getMatches = async (req, res, next) => {
  try {
    const requirement = await RoomRequirement.findOne({ user: req.user._id });

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Please submit your room requirements first.'
      });
    }

    const filter = {
      status: 'active',
      availabilityStatus: 'available',
      monthlyRent: { $lte: requirement.budgetMax }
    };

    if (requirement.budgetMin > 0) {
      filter.monthlyRent.$gte = requirement.budgetMin;
    }

    if (requirement.preferredCity) {
      filter['address.city'] = { $regex: requirement.preferredCity, $options: 'i' };
    }

    if (requirement.propertyType && requirement.propertyType !== 'any') {
      filter.propertyType = requirement.propertyType;
    }

    if (requirement.roomType && requirement.roomType !== 'any') {
      filter.roomType = requirement.roomType;
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone profileImage')
      .lean({ virtuals: true });

    const scoredProperties = properties.map(property => {
      let score = 0;
      let maxScore = 100;

      // City match (25 points)
      if (requirement.preferredCity && property.address.city.toLowerCase().includes(requirement.preferredCity.toLowerCase())) {
        score += 25;
      }

      // Budget match (20 points)
      if (property.monthlyRent <= requirement.budgetMax) {
        score += 20;
      }

      // Room type match (15 points)
      if (requirement.roomType === 'any' || property.roomType === requirement.roomType) {
        score += 15;
      }

      // Property type match (15 points)
      if (requirement.propertyType === 'any' || property.propertyType === requirement.propertyType) {
        score += 15;
      }

      // Amenities match (15 points)
      if (requirement.requiredAmenities && requirement.requiredAmenities.length > 0) {
        const matched = requirement.requiredAmenities.filter(a => property.amenities.includes(a));
        score += (matched.length / requirement.requiredAmenities.length) * 15;
      } else {
        score += 15;
      }

      // Furnishing match (10 points)
      if (requirement.furnishingPreference === 'any' || property.furnishingStatus === requirement.furnishingPreference) {
        score += 10;
      }

      return {
        ...property,
        matchScore: Math.round((score / maxScore) * 100)
      };
    });

    scoredProperties.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      requirement,
      matches: scoredProperties,
      total: scoredProperties.length
    });
  } catch (error) {
    next(error);
  }
};
