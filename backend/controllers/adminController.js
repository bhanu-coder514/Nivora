const User = require('../models/User');
const Property = require('../models/Property');

// Dashboard stats
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers, totalOwners, totalStudents,
      totalProperties, availableProperties
    ] = await Promise.all([
      User.countDocuments({ accountStatus: 'active' }),
      User.countDocuments({ role: 'owner', accountStatus: 'active' }),
      User.countDocuments({ role: 'student', accountStatus: 'active' }),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'active', availabilityStatus: 'available' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, totalOwners, totalStudents,
        totalProperties, availableProperties
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// Get all properties
exports.getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, properties });
  } catch (error) {
    next(error);
  }
};

// Update user status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot modify another admin.' });
    }

    user.accountStatus = status;
    await user.save();

    res.json({ success: true, message: `User ${status}.`, user });
  } catch (error) {
    next(error);
  }
};

// Delete property
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, message: 'Property deleted.' });
  } catch (error) {
    next(error);
  }
};
