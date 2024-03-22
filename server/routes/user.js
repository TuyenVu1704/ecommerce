import express, { Router } from 'express';
import { registerUser } from '../controllers/user.js';
import { errHandler, notFound } from '../middlewares/errHandler.js';
const router = express.Router();

// api/user/register
router.post(`/register`, registerUser);

export default router;
