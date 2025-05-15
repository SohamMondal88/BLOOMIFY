// controllers/orders.js
const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id })
    .sort('-createdAt')
    .populate('items.product', 'name price images');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate('items.product', 'name price images');

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  if (order.status !== 'Processing') {
    return next(
      new ErrorResponse(`Only processing orders can be cancelled`, 400)
    );
  }

  order.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});