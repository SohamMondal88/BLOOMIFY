const mongoose = require('mongoose');
const validator = require('validator');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please enter full name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter phone number'],
    trim: true
  },
  addressLine1: {
    type: String,
    required: [true, 'Please enter address line 1'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please enter city'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please enter state/region'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'Please enter ZIP/postal code'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please enter country'],
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);