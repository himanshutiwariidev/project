// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');
const { uploadProduct } = require('../middleware/UploadMiddleware');
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Routes
router.get('/', getProducts);                  // Get all products
router.get('/:id', getProductById);            // Get product by ID

// Admin only:
router.post('/', isAdmin, uploadProduct, addProduct); // Add product (main + gallery)
router.put('/:id', isAdmin, updateProduct);           // Update product
router.delete('/:id', isAdmin, deleteProduct);        // Delete product

module.exports = router;
