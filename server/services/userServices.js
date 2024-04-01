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
  const response = await User.find();
  return response;
});

export { passwordReset, getAllUsers };
