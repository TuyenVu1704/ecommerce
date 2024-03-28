import jwt from 'jsonwebtoken';

const generateAccessToken = (uid, role) =>
  jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '2d' });

const generateRefeshToken = (uid, role) =>
  jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '7d' });

export { generateAccessToken, generateRefeshToken };
