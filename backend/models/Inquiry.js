const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'accepted', 'rejected', 'closed'],
    default: 'pending'
  },
  ownerResponse: {
    type: String,
    default: '',
    maxlength: 1000
  }
}, {
  timestamps: true
});

inquirySchema.index({ student: 1, property: 1 });
inquirySchema.index({ owner: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
