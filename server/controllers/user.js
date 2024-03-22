import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !lastName || !firstName)
    return res.status(400).json({
      success: false,
      message: 'Missing inputs',
    });
  const saltHash = bcrypt.genSaltSync(parseInt(process.env.SALT_HASH));
  const hashPassword = await bcrypt.hash(password, saltHash);
  const response = await User.create({
    ...req.body,
    password: hashPassword,
  });

  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

export { registerUser };
