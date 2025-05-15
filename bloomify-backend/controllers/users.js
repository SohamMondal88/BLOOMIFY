const User = require('../models/User');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Address = require('../models/Address');
const asyncHandler = require('../middleware/async');

// @desc    Update user details
// @route   PUT /api/users/me
exports.updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone
  };
  
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  }).select('-password -tokens');
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/users/me/password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return res.status(401).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }
  
  user.password = req.body.newPassword;
  await user.save();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user orders
// @route   GET /api/users/me/orders
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id })
    .sort('-createdAt')
    .populate('items.product', 'name price images');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get user wishlist
// @route   GET /api/users/me/wishlist
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id })
    .populate('items.product', 'name price images ecoCertificates carbonFootprint');
  
  res.status(200).json({
    success: true,
    data: wishlist || { items: [] }
  });
});

// @desc    Add to wishlist
// @route   POST /api/users/me/wishlist
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ userId: req.user.id });
  
  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: req.user.id,
      items: [{ product: req.body.productId }]
    });
  } else {
    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product.toString() === req.body.productId
    );
    
    if (!existingItem) {
      wishlist.items.push({ product: req.body.productId });
      await wishlist.save();
    }
  }
  
  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Remove from wishlist
// @route   DELETE /api/users/me/wishlist/:productId
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id });
  
  if (!wishlist) {
    return res.status(404).json({
      success: false,
      error: 'Wishlist not found'
    });
  }
  
  wishlist.items = wishlist.items.filter(
    item => item.product.toString() !== req.params.productId
  );
  
  await wishlist.save();
  
  res.status(200).json({
    success: true,
    data: wishlist
  });
});