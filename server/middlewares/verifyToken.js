import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const verifyToken = asyncHandler(async (req, res, next) => {
  //Bearer token

  if (req?.headers?.authorization?.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];

    // kiem tra token , sau ddo tra ve err vaf decode
    // decode: tra ve gia tri dua tren ham dang ky jwt
    //const generateAccessToken = (uid, role) =>
    //jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '3d' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: 'Invalid access Token',
        });

      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: 'Require authentication !!!',
    });
  }
});

export { verifyToken };
