import asyncHandler from 'express-async-handler';
import {
  createProductsrv,
  delProductsrv,
  getAllProductsrv,
  getProductsrv,
  updateProductsrv,
} from '../services/productServices.js';
import slugify from 'slugify';

// Tao product
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await createProductsrv(req.body);

  return res.status(200).json({
    success: newProduct ? true : false,
    createProduct: newProduct ? newProduct : 'Cannot product create',
  });
});

// Lay 1 san pham
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await getProductsrv(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? products : 'Cannot get product ',
  });
});

// Get ALL product
const getAllProduct = asyncHandler(async (req, res) => {
  const products = await getAllProductsrv();
  return res.status(200).json({
    success: products ? true : false,
    productsData: products ? products : 'Cannot get products ',
  });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  const newProduct = await updateProductsrv(pid, req.body);
  console.log(newProduct);
  return res.status(200).json({
    success: newProduct ? true : false,
    updateProduct: newProduct ? newProduct : 'Cannot update Product',
  });
});

// Delete Product
const delProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  const newProduct = await delProductsrv(pid);

  return res.status(200).json({
    success: newProduct ? true : false,
    delProduct: newProduct ? newProduct : 'Cannot delete Product',
  });
});
export { createProduct, getProduct, getAllProduct, updateProduct, delProduct };
