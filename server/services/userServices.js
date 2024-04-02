import crypto from 'crypto';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
const passwordReset = async ({ email }) => {
  if (!email) throw new Error('Missing Email');
  const user = await User.findOne({ email });

  if (!user) throw new Error('User not found');
  const resetToken = crypto.randomBytes(32).toString('hex');

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const passwordResetExpire = Date.now() + 5 * 60 * 1000;

  const newPasswordReset = await User.findOneAndUpdate(
    { email },
    { passwordResetToken, passwordResetExpire },
    { new: true }
  );

  return resetToken;
};

// Get ALL USER

const getAllUsers = asyncHandler(async () => {
  const response = await User.find().select('-refeshToken -password -role');
  return response;
});

// Delete User

const deleteUsersrv = asyncHandler(async (_id) => {
  if (!_id) throw new Error('Missing input');
  const result = await User.findByIdAndDelete(_id);
  return result;
});

// Update User

const updateUsersrv = asyncHandler(async (_id, data) => {
  if (!_id || Object.keys(data || []).length === 0)
    throw new Error('Missing Input');

  const result = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select('-password -role');

  return result;
});

//// Update User by Admin

const updateUserByAdminrsrv = asyncHandler(async (uid, data) => {
  console.log(uid, data);
  if (Object.keys(data || []).length === 0) throw new Error('Missing Input');

  const result = await User.findByIdAndUpdate(uid, data, {
    new: true,
  }).select('-password -role');

  return result;
});
export {
  passwordReset,
  getAllUsers,
  deleteUsersrv,
  updateUsersrv,
  updateUserByAdminrsrv,
};
