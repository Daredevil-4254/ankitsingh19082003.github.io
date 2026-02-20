require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./src/app");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    throw err;
  }
};

// Vercel serverless: wrap app to ensure DB connected before each request
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
