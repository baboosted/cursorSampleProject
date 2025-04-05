module.exports = (req, res) => {
  res.status(200).json({
    message: "API endpoint test successful",
    method: req.method,
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
};
