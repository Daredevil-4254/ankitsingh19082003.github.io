require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app"); // Import the configured app from app.js

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5050;

// --- THE FIX IS HERE ---

// 1. Only listen to the port if we are running LOCALLY (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
  });
}

// 2. EXPORT the app so Vercel can use it
module.exports = app;