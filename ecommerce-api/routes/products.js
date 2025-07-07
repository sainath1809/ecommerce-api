const express = require('express');
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { verifyToken, isAdmin } = require('../middleware/auth');

// ➕ POST /api/products - Add a product (Admin only)
router.post('/', verifyToken, isAdmin, addProduct);

// 📦 GET /api/products - Get all products (Public)
router.get('/', getAllProducts);

// 🔍 GET /api/products/:id - Get product by ID (Public)
router.get('/:id', getProductById);

// 📝 PUT /api/products/:id - Update product (Admin only)
router.put('/:id', verifyToken, isAdmin, updateProduct);

// 🗑️ DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
