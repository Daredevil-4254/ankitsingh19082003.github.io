const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");
const { signToken } = require("../../services/auth.service");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(admin);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
