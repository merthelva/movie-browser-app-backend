module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const reason = err.data;

  res.status(statusCode).json({ reason });
};
