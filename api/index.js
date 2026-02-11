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

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Ensure this only handles /api/* routes
  if (!req.url.startsWith('/api/')) {
    return res.status(404).send('Not Found');
  }

  // Pass to Express app
  return app(req, res);
};
