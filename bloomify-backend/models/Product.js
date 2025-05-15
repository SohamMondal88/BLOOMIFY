const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number
  },
  onSale: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
   required: [true, 'Please enter product stock'],
   min: [0, 'Stock cannot be negative']
 },
 images: [{
   type: String,
   required: [true, 'Please upload at least one image']
 }],
 ecoCertificates: [{
   type: String,
   enum: ['Organic', 'Recycled', 'Biodegradable', 'Sustainable', 'FairTrade']
 }],
 carbonFootprint: {
   type: Number,
   default: 0
 },
 category: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Category',
   required: true
 },
 active: {
   type: Boolean,
   default: true
 }
 }, {
timestamps: true
});

module.exports = mongoose.model('Product', productSchema);