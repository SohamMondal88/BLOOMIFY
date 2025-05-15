const express = require('express');
const router = express.Router();
const { 
  updateUser, 
  changePassword,
  getUserOrders,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/users');
const { protect } = require('../middleware/auth');

router.put('/me', protect, updateUser);
router.put('/me/password', protect, changePassword);
router.get('/me/orders', protect, getUserOrders);
router.get('/me/wishlist', protect, getUserWishlist);
router.post('/me/wishlist', protect, addToWishlist);
router.delete('/me/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;