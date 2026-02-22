const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin");
const { signToken } = require("../../services/auth.service");
const requireAuth = require("../../middlewares/auth.middleware");

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

router.get("/verify", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

router.put("/update", requireAuth, async (req, res, next) => {
  try {
    const { newUsername, newPassword } = req.body;

    // Find the currently logged-in admin
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    if (newUsername) admin.username = newUsername;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      admin.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();

    // Sign a fresh token in case the username is stored or they need a new session
    const token = signToken(admin);
    res.json({ message: "Credentials updated successfully", token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
