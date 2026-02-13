const jwt = require("jsonwebtoken");

const signToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
