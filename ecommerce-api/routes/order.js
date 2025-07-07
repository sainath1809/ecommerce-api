const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// ✅ Place order (checkout)
router.post('/', verifyToken, placeOrder);

// ✅ Get user's orders
router.get('/', verifyToken, getOrders);

module.exports = router;
