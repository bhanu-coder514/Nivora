const mongoose = require('mongoose');

const roomRequirementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  preferredCity: {
    type: String,
    required: [true, 'Preferred city is required'],
    trim: true
  },
  preferredLocality: {
    type: String,
    default: '',
    trim: true
  },
  college: { type: String, default: '' },
  workplace: { type: String, default: '' },
  propertyType: {
    type: String,
    enum: ['pg', 'hostel', 'flat', 'independent-room', 'shared-apartment', 'studio', 'any'],
    default: 'any'
  },
  roomType: {
    type: String,
    enum: ['single', 'double-sharing', 'triple-sharing', 'studio', '1bhk', '2bhk', '3bhk', 'any'],
    default: 'any'
  },
  budgetMin: {
    type: Number,
    default: 0,
    min: 0
  },
  budgetMax: {
    type: Number,
    required: [true, 'Maximum budget is required'],
    min: 0
  },
  maxMonthlyLivingCost: {
    type: Number,
    default: null
  },
  requiredAmenities: [{
    type: String
  }],
  furnishingPreference: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished', 'any'],
    default: 'any'
  },
  moveInDate: {
    type: Date,
    default: null
  },
  rentalDuration: {
    type: Number,
    default: null
  },
  occupancy: {
    type: Number,
    default: 1,
    min: 1
  },
  additionalRequirements: {
    type: String,
    default: '',
    maxlength: 1000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RoomRequirement', roomRequirementSchema);
