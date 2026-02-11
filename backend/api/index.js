require('dotenv').config();
const mongoose = require("mongoose");
// This points to your existing app.js inside src
const app = require("../src/app");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected");
  } catch (err) {
    console.error(" DB Error:", err.message);
  }
};

connectDB();

// CRITICAL: Only handle /api/* routes, return 404 for everything else
// This forces Vercel to serve static files for non-API routes
module.exports = (req, res) => {
  // Only process routes that start with /api/
  if (req.url.startsWith('/api/')) {
    return app(req, res);
  }

  // For all other routes, return 404 to let Vercel handle static files
  res.status(404).json({ error: 'Not Found - This is the API endpoint' });
};
