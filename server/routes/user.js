import express from 'express';
import {
  forgotPassword,
  getAllUser,
  getCurrentUSer,
  logOutUser,
  loginUser,
  refeshAccessToKen,
  registerUser,
  resetPassword,
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
export default router;
