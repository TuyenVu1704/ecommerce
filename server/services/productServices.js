import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// Tao Product

const createProductsrv = asyncHandler(async (data) => {
  if (Object.keys(data || []).length === 0) throw new Error('Missing Input');
  if (data && data?.title) data.slug = slugify(data.title, { locale: 'vi' });
  const result = await Product.create(data);
  return result;
});

// Lay 1 product
const getProductsrv = asyncHandler(async (id) => {
  if (!id) throw new Error('Missing product');
  const result = await Product.findById(id);
  return result;
});

// Lay All Product
const getAllProductsrv = asyncHandler(async () => {
  const result = await Product.find();
  return result;
});

// Update Product
const updateProductsrv = asyncHandler(async (id, data) => {
  if (!id || !data) throw new Error('Missing input');
  if (data && data?.title) data.slug = slugify(data.title, { locale: 'vi' });

  const result = await Product.findByIdAndUpdate(id, data, { new: true });
  console.log(result);
  return result;
});

// Delete Product
const delProductsrv = asyncHandler(async (id) => {
  const result = await Product.findByIdAndDelete(id);

  return result;
});
export {
  createProductsrv,
  getProductsrv,
  getAllProductsrv,
  updateProductsrv,
  delProductsrv,
};
