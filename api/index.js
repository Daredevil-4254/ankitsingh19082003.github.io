require('dotenv').config();
const mongoose = require("mongoose");
const app = require("../backend/src/app");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
};

connectDB();

// Export for Vercel serverless function
module.exports = app;
