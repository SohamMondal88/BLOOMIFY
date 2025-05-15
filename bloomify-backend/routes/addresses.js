const express = require('express');
const router = express.Router();
const { 
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addresses');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAddresses);
router.get('/:id', protect, getAddress);
router.post('/', protect, createAddress);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);
router.put('/:id/default', protect, setDefaultAddress);

module.exports = router;