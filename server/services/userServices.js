import crypto from 'crypto';
import User from '../models/User';

const passwordReset = async ({ email }) => {
  if (!email) throw new Error('Missing Email');
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha26')
    .update(resetToken)
    .digest('hex');
  const passwordResetExpire = Date.now() + 5 * 60 * 1000;
  const newPasswordReset = await User.create({
    ...user,
    passwordResetToken,
    passwordResetExpire,
  });
  return newPasswordReset;
};

export { passwordReset };
