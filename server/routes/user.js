import express from 'express';
import {
  deleteUser,
  forgotPassword,
  getAllUser,
  getCurrentUSer,
  logOutUser,
  loginUser,
  refeshAccessToKen,
  registerUser,
  resetPassword,
  updateUser,
  updateUserByAdmin,
} from '../controllers/user.js';
import { isAdmin, verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// api/user/register
router.post(`/register`, registerUser);
router.post('/login', loginUser);
router.get('/current', verifyToken, getCurrentUSer);
router.post('/refeshtoken', refeshAccessToKen);
router.get('/logout', logOutUser);
router.get('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.get('/', [verifyToken, isAdmin], getAllUser);
router.delete('/', [verifyToken, isAdmin], deleteUser);
router.put('/:uid', [verifyToken, isAdmin], updateUserByAdmin);
router.put('/current', [verifyToken], updateUser);
export default router;
