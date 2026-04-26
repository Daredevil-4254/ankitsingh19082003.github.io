const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 1. Ensure 'uploads' directory exists in the project root
// We go up 3 levels: src/routes/admin -> src/routes -> src -> ROOT
const uploadDir = path.join(__dirname, '../../../uploads'); 

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Configure Multer Storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function(req, file, cb) {
    // Save as: img-123456789.jpg
    cb(null, 'img-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Error: Images Only!');
  }
}).single('image'); // Expects form-data field name: "image"

// 3. The Route
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err });
    if (!req.file) return res.status(400).json({ message: 'No file selected!' });
    
    // Return the URL that the frontend can display
    res.json({ 
      message: 'File Uploaded!',
      imageUrl: `/uploads/${req.file.filename}` 
    });
  });
});

module.exports = router;