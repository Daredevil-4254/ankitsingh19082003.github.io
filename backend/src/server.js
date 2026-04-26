require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5050;


// We define this HERE to prevent Vercel from crashing if the DB is slow
const connectDB = async () => {
  // 1. If already connected, stop here (Optimized for Vercel)
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    // 2. Check if the Variable exists
    if (!process.env.MONGO_URI) {
      console.error("FATAL ERROR: MONGO_URI is missing in Vercel Settings!");
      return; 
    }

    // 3. Connect safely
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully");

  } catch (err) {
    console.error(" MongoDB Connection Failed:", err.message);
    // CRITICAL: We do NOT use process.exit(1) here. 
    // This allows Vercel to keep running and show us the error log.
  }
};

// Start the connection immediately
connectDB();

// --- SERVER LISTENER ---
// Only listen to the port if we are running LOCALLY (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;