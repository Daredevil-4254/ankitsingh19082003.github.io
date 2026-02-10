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

module.exports = app;
