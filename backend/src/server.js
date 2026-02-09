require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app"); // Import the configured app from app.js

// Connect to Database
connectDB();

// Vercel and other hosts provide a PORT dynamically. 
// We use 5050 as a fallback for your local testing.
const PORT = process.env.PORT || 5050;

// REMOVED '127.0.0.1' to allow external connections (Handshake fix)
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});