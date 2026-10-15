const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Wishlist = require('../models/Wishlist');
const RoomRequirement = require('../models/RoomRequirement');

// Owner dashboard
exports.ownerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [properties, inquiries] = await Promise.all([
      Property.find({ owner: ownerId }).lean({ virtuals: true }),
      Inquiry.find({ owner: ownerId })
        .populate('property', 'title')
        .populate('student', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    const totalProperties = properties.length;
    const availableProperties = properties.filter(p => p.availabilityStatus === 'available').length;
    const unavailableProperties = properties.filter(p => p.availabilityStatus === 'unavailable').length;
    const totalInquiries = await Inquiry.countDocuments({ owner: ownerId });
    const pendingInquiries = await Inquiry.countDocuments({ owner: ownerId, status: 'pending' });
    const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalProperties,
        availableProperties,
        unavailableProperties,
        totalInquiries,
        pendingInquiries,
        totalViews
      },
      recentProperties: properties.slice(0, 5),
      recentInquiries: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// Student dashboard
exports.studentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [wishlist, inquiries, requirements] = await Promise.all([
      Wishlist.findOne({ user: userId }).populate({
        path: 'properties',
        select: 'title images monthlyRent address roomType availabilityStatus',
        populate: { path: 'owner', select: 'name' }
      }),
      Inquiry.find({ student: userId })
        .populate('property', 'title images monthlyRent address')
        .sort({ createdAt: -1 })
        .limit(5),
      RoomRequirement.findOne({ user: userId })
    ]);

    res.json({
      success: true,
      stats: {
        savedProperties: wishlist ? wishlist.properties.length : 0,
        totalInquiries: await Inquiry.countDocuments({ student: userId }),
        pendingInquiries: await Inquiry.countDocuments({ student: userId, status: 'pending' }),
        hasRequirements: !!requirements
      },
      savedProperties: wishlist ? wishlist.properties : [],
      recentInquiries: inquiries,
      requirements
    });
  } catch (error) {
    next(error);
  }
};
