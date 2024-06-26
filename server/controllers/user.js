import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefeshToken,
} from '../middlewares/jwt.js';

import jwt from 'jsonwebtoken';
import {
  deleteUsersrv,
  getAllUsers,
  passwordReset,
  updateUsersrv,
  updateUserByAdminrsrv,
} from '../services/userServices.js';
import sendMail from '../ultils/sendMail.js';
import crypto from 'crypto';
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: 'Missing inputs',
    });
  // Check user exited

  const user = await User.findOne({ email });
  if (user) {
    throw new Error('User has exited!!!');
  } else {
    // Hash Password Cach 1
    const saltHash = bcrypt.genSaltSync(parseInt(process.env.SALT_HASH));
    const hashPassword = await bcrypt.hash(password, saltHash);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
    });

    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? 'Register is successfully. Please go login'
        : 'Something went wrong',
    });
  }
});

// Login USer

const loginUser = asyncHandler(async (req, res) => {
  if (!req.body)
    return res.status(400).json({
      success: false,
      message: 'Missing inputs',
    });

  const extitedUser = await User.findOne({ email: req.body.email });
  const matchPassword = await bcrypt.compare(
    req.body.password,
    extitedUser?.password
  );

  if (matchPassword && extitedUser) {
    // Tach pass va role ra khoi user
    const { password, role, refeshToken, ...userData } = extitedUser.toObject();
    // tao accesstoKen va refeshToken
    const accessToken = generateAccessToken(extitedUser._id, role);
    const newrefeshToken = generateRefeshToken(extitedUser._id);
    // Update refeshToken vao database, luu y: de new = true de tra ve gia tri sau khi update
    await User.findByIdAndUpdate(
      extitedUser._id,
      { refeshToken: newrefeshToken },
      { new: true }
    );

    // Luu refeshtoken vao cookie
    res.cookie('refeshtoken', newrefeshToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      userData,
      accessToken,
    });
  } else throw new Error('Email or password Wrong!!!');
});

// Tao AccessToken moi khi accesstoken cu het han dua vao refesh Token
const refeshAccessToKen = asyncHandler(async (req, res) => {
  // Lay du lieu tu cookies
  const cookie = req.cookies;

  //kiem tra cookie co ton tai hay khong
  if (!cookie && !cookie.refeshtoken)
    throw new Error('No refresh Token in cookies');

  // Kiem tra refeshToken trong cookie

  const result = await jwt.verify(cookie.refeshtoken, process.env.JWT_SECRET);
  console.log(result._id);
  // Kiem tra xem token co khop voi token da luu trong db

  const response = await User.findOne({
    _id: result._id,
    refeshToken: cookie.refeshtoken,
  });

  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id)
      : 'Refesh Token not matched',
  });
});

// Get One User
const getCurrentUSer = asyncHandler(async (req, res) => {
  // Lay id tu req.user trong verifyToken
  const { _id } = req.user;

  const user = await User.findById(_id).select('-refeshToken -password -role');
  return res.status(200).json({
    success: true,
    result: user ? user : 'User not found',
  });
});

// Logout user

const logOutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // Kiem tra trong cookie co refesh token hay khong
  if (!cookie || !cookie.refeshtoken)
    throw new Error('No Refesh Token in cookies');

  // Tim refesh token co refesh token co trung voi refesh dang luu duoi trinh duyet hay khong
  // Xoa refeshToken tren database
  await User.findOneAndUpdate(
    { refeshToken: cookie.refeshtoken },
    { refeshToken: ' ' },
    { new: true }
  );

  // Xoa refreshToken o cookie trinh duyet
  res.clearCookie('refeshtoken', {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    mes: 'Logout is done',
  });
});

// Reset Password
// Flow chart:
// client gui email len server
// Server check mail co hop le hay khong => gui mail ve client kem theo link (password chagne token)
// Client check mail
// client gui api kem token len server
// server checktoken co giong voi token ma server gui mail hay khong

// Ham check mail va gui mail

const forgotPassword = asyncHandler(async (req, res) => {
  // Lay  POST + PUT lay o body
  // GET + DELETE lay o query
  const { email } = req.query;
  const resetToken = await passwordReset({ email });

  const html = `Vui long nhap vao link de reset password <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}">Click here</a>`;
  //
  const data = {
    email: email,
    html,
  };

  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
  });
});

// Reset Password

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!password || !token) throw new Error('Missing Password or Token');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) throw new Error('Invalid Reset Token');
  const saltHash = bcrypt.genSaltSync(parseInt(process.env.SALT_HASH));
  const hashPassword = await bcrypt.hash(password, saltHash);
  await User.findByIdAndUpdate(user._id, {
    password: hashPassword,
    passwordResetToken: ' ',
    passwordResetExpire: ' ',
    passwordChangeAt: Date.now(),
    new: true,
  });
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? 'Update passwrod' : 'Something went wrong',
  });
});

// Get All User

const getAllUser = asyncHandler(async (req, res) => {
  const users = await getAllUsers();

  return res.status(200).json({
    success: users ? true : false,
    users,
  });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  const newUser = await deleteUsersrv(_id);
  return res.status(200).json({
    success: newUser ? true : false,
    delleteUser: newUser
      ? `User with email ${newUser.email} deleted`
      : `No User delete`,
  });
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
  // Lay _id cua verifytoken tra ve
  const { _id } = req.user;
  const newUser = await updateUsersrv(_id, req.body);
  return res.status(200).json({
    success: newUser ? true : false,
    updateUser: newUser ? newUser : 'Some thing went wrong',
  });
});

//Update User by Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  // Lay _id cua verifytoken tra ve
  const { uid } = req.params;

  const newUser = await updateUserByAdminrsrv(uid, req.body);
  return res.status(200).json({
    success: newUser ? true : false,
    updateUser: newUser ? newUser : 'Some thing went wrong',
  });
});
export {
  registerUser,
  loginUser,
  getCurrentUSer,
  refeshAccessToKen,
  logOutUser,
  forgotPassword,
  resetPassword,
  getAllUser,
  deleteUser,
  updateUser,
  updateUserByAdmin,
};
