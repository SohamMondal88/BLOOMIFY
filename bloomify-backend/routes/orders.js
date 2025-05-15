const express = require('express');
const router = express.Router();
const { 
  getOrders,
  getOrder,
  cancelOrder
} = require('../controllers/orders');
const { protect } = require('../middleware/auth');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;