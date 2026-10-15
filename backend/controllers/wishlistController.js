const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

// Get wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'properties',
        populate: { path: 'owner', select: 'name' }
      });

    res.json({
      success: true,
      properties: wishlist ? wishlist.properties : []
    });
  } catch (error) {
    next(error);
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        properties: [req.params.propertyId]
      });
    } else {
      if (wishlist.properties.includes(req.params.propertyId)) {
        return res.status(400).json({ success: false, message: 'Property already in wishlist.' });
      }
      wishlist.properties.push(req.params.propertyId);
      await wishlist.save();
    }

    res.json({ success: true, message: 'Property added to wishlist!' });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found.' });
    }

    wishlist.properties = wishlist.properties.filter(
      id => id.toString() !== req.params.propertyId
    );
    await wishlist.save();

    res.json({ success: true, message: 'Property removed from wishlist.' });
  } catch (error) {
    next(error);
  }
};
