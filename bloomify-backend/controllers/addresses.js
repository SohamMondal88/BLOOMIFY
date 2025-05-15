// controllers/addresses.js
const Address = require('../models/Address');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all addresses
// @route   GET /api/addresses
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const addresses = await Address.find({ userId: req.user.id })
    .sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses
  });
});

// @desc    Get single address
// @route   GET /api/addresses/:id
exports.getAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Create new address
// @route   POST /api/addresses
exports.createAddress = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  // If setting as default, remove default from others
  if (req.body.isDefault) {
    await Address.updateMany(
      { userId: req.user.id, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create(req.body);

  res.status(201).json({
    success: true,
    data: address
  });
});

// @desc    Update address
// @route   PUT /api/addresses/:id
exports.updateAddress = asyncHandler(async (req, res, next) => {
  let address = await Address.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // If setting as default, remove default from others
  if (req.body.isDefault && !address.isDefault) {
    await Address.updateMany(
      { userId: req.user.id, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  await address.remove();

  // If default was deleted, set a new default
  if (address.isDefault) {
    const newDefault = await Address.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (newDefault) {
      newDefault.isDefault = true;
      await newDefault.save();
    }
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
exports.setDefaultAddress = asyncHandler(async (req, res, next) => {
  // Remove default from all addresses
  await Address.updateMany(
    { userId: req.user.id, isDefault: true },
    { $set: { isDefault: false } }
  );

  // Set new default address
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { isDefault: true } },
    { new: true }
  );

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: address
  });
});