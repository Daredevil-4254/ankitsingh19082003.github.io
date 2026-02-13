const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/upload.middleware");

const { 
  getHighlights, 
  getHighlightById, 
  createHighlight, 
  updateHighlight, 
  deleteHighlight 
} = require("../../controllers/highlight.controller");

// Define Upload Configuration
// This tells the route to expect a main image ('poster') and multiple gallery images ('gallery')
const uploadFields = upload.fields([
  { name: 'poster', maxCount: 1 },  // Matches req.files['poster'] in controller
  { name: 'gallery', maxCount: 10 } // Matches req.files['gallery'] in controller
]);

// GET all
router.get("/", getHighlights);

// GET single
router.get("/:id", getHighlightById);

// POST (Create) - Uses upload middleware
router.post("/", uploadFields, createHighlight);

// PUT (Update) - Uses upload middleware
router.put("/:id", uploadFields, updateHighlight);

// DELETE
router.delete("/:id", deleteHighlight);

module.exports = router;