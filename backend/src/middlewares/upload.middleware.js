const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Ensure 'uploads' directory exists
// This creates a folder named "uploads" in your backend root if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.warn("Could not create upload directory (expected on Vercel):", err.message);
  }
}

// 2. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename: fieldname-timestamp.ext
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// 3. File Filter (Images Only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// 4. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5MB
});

module.exports = upload;