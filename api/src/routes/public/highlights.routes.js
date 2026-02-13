const express = require("express");
const router = express.Router();
const { 
  getHighlights, 
  getHighlightById 
} = require("../../controllers/highlight.controller");

// Only allow reading (GET) for the public website
router.get("/", getHighlights); 
router.get("/:id", getHighlightById); 

module.exports = router;