require('dotenv').config();
const mongoose = require("mongoose");
// Import your existing App logic from the src folder
const app = require("../src/app");

// 1. Define the connection logic
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Reuse connection

  try {
    if (!process.env.MONGO_URI) {
      console.error(" MONGO_URI is missing from Vercel Environment Variables");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected via Vercel Adapter");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
  }
};

// 2. Connect immediately
connectDB();

// 3. Export the app (Vercel requires this)
module.exports = app;
