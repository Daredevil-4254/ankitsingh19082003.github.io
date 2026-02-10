const mongoose = require("mongoose");

const connectDB = async () => {
  // Comment out the logic inside if you're nervous, 
  // but removing the call from server.js is the real fix.
  /*
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
  }
  */
};

module.exports = connectDB;