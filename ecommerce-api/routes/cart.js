const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem
} = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

// ➕ Add to Cart
router.post('/', verifyToken, addToCart);

// 🧺 Get Cart
router.get('/', verifyToken, getCart);

// 🔁 Update Cart Item
router.put('/:id', verifyToken, updateCartItem);

// 🗑️ Delete Cart Item
router.delete('/:id', verifyToken, deleteCartItem);

module.exports = router;
