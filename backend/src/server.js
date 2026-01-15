require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app"); // Import the configured app

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`); //
});