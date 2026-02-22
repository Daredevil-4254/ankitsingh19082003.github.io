const jwt = require("jsonwebtoken");

const signToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: "1d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
};

module.exports = {
  signToken,
  verifyToken,
};
