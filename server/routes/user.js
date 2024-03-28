import express from 'express';
import {
  getCurrentUSer,
  logOutUser,
  loginUser,
  refeshAccessToKen,
  registerUser,
} from '../controllers/user.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// api/user/register
router.post(`/register`, registerUser);
router.post('/login', loginUser);
router.get('/current', verifyToken, getCurrentUSer);
router.post('/refeshtoken', refeshAccessToKen);
router.get('/logout', logOutUser);
export default router;
