const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: Number, default: null },
  type: { type: String, enum: ['fixed', 'variable', 'usage-based', 'shared', 'not-provided'], default: 'fixed' },
  basis: { type: String, enum: ['per-person', 'per-room', 'total'], default: 'per-room' },
  note: { type: String, default: '' }
}, { _id: false });

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['pg', 'hostel', 'flat', 'independent-room', 'shared-apartment', 'studio']
  },
  roomType: {
    type: String,
    required: true,
    enum: ['single', 'double-sharing', 'triple-sharing', 'studio', '1bhk', '2bhk', '3bhk']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true, index: true },
    locality: { type: String, required: true, index: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true, match: [/^\d{6}$/, 'PIN code must be 6 digits'] }
  },
  nearbyCollege: { type: String, default: '' },
  nearbyWorkplace: { type: String, default: '' },
  floorNumber: { type: Number, default: null },
  totalRooms: { type: Number, default: null },
  maxOccupancy: { type: Number, default: 1, min: 1 },
  furnishingStatus: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    default: 'semi-furnished'
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isCover: { type: Boolean, default: false }
  }],
  amenities: [{
    type: String,
    enum: [
      'bed', 'mattress', 'wardrobe', 'study-table', 'chair',
      'fan', 'ac', 'cooler', 'attached-bathroom', 'shared-bathroom',
      'kitchen', 'refrigerator', 'washing-machine', 'wifi', 'parking',
      'water-supply', 'power-backup', 'cctv', 'security', 'balcony',
      'lift', 'furnished-kitchen'
    ]
  }],
  monthlyRent: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  rentBasis: {
    type: String,
    enum: ['per-person', 'per-room'],
    default: 'per-room'
  },
  securityDeposit: {
    type: Number,
    default: null,
    min: [0, 'Security deposit cannot be negative']
  },
  monthlyExpenses: [expenseSchema],
  oneTimeExpenses: [expenseSchema],
  availabilityStatus: {
    type: String,
    enum: ['available', 'unavailable', 'upcoming'],
    default: 'available',
    index: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  minimumStay: {
    type: Number,
    default: 1,
    min: 1
  },
  preferredTenant: {
    type: String,
    enum: ['any', 'students', 'working-professionals', 'family'],
    default: 'any'
  },
  contactPreference: {
    type: String,
    enum: ['phone', 'email', 'both', 'in-app'],
    default: 'in-app'
  },
  status: {
    type: String,
    enum: ['active', 'removed', 'reported'],
    default: 'active'
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual: compute estimated monthly accommodation cost
propertySchema.virtual('estimatedMonthlyCost').get(function() {
  let total = this.monthlyRent || 0;
  if (this.monthlyExpenses && this.monthlyExpenses.length > 0) {
    this.monthlyExpenses.forEach(exp => {
      if (exp.amount !== null && exp.amount !== undefined) {
        total += exp.amount;
      }
    });
  }
  return total;
});

// Virtual: compute initial move-in cost
propertySchema.virtual('initialMoveInCost').get(function() {
  let total = this.monthlyRent || 0;
  if (this.securityDeposit) total += this.securityDeposit;
  if (this.oneTimeExpenses && this.oneTimeExpenses.length > 0) {
    this.oneTimeExpenses.forEach(exp => {
      if (exp.amount !== null && exp.amount !== undefined) {
        total += exp.amount;
      }
    });
  }
  return total;
});

propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

// Indexes
propertySchema.index({ title: 'text', description: 'text', 'address.city': 'text', 'address.locality': 'text' });
propertySchema.index({ monthlyRent: 1 });
propertySchema.index({ 'address.pinCode': 1 });

module.exports = mongoose.model('Property', propertySchema);
