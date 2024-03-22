const notFound = (req, res, next) => {
  const error = new Error('Không tìmm thấy' + req.originalUrl);
  res.status(404);
  next(error);
};

const errHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    message: error?.message,
  });
};

export { notFound, errHandler };
