require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../src/models/Admin");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      passwordHash,
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Admin creation failed:", err.message);
    process.exit(1);
  }
})();
