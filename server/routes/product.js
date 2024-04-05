import express from 'express';
import {
  createProduct,
  delProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from '../controllers/products.js';
import { isAdmin, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// api/product/
//create product
router.post(`/`, [verifyToken, isAdmin], createProduct);

//get All Product
router.get('/', getAllProduct);

//get product
router.get('/:pid', getProduct);
//Update Product
router.put('/:pid', [verifyToken, isAdmin], updateProduct);
//Update Product
router.delete('/:pid', [verifyToken, isAdmin], delProduct);

export default router;
