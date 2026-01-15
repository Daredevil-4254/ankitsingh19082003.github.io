const multer = require("multer");
const path = require("path");

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure this folder exists in your backend root!
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    // Rename file to avoid conflicts (timestamp + original name)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File Filter (Optional: Only accept images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;