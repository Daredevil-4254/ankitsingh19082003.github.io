const express = require("express");
const router = express.Router();

// 1. Import from the correct Controller path
// Note: We go up two levels (../../) to find 'controllers'
const { 
  getHighlights, 
  getHighlightById, 
  createHighlight, 
  updateHighlight, 
  deleteHighlight 
} = require("../../controllers/highlight.controller");

// 2. Define Routes
// We check if the functions exist before using them to prevent the "handler must be a function" crash.

if (!getHighlights || !createHighlight) {
    console.error("CRITICAL ERROR: Controller functions are missing. Check src/controllers/highlight.controller.js");
}

// GET all (for admin list)
router.get("/", getHighlights);

// GET single (for editing)
router.get("/:id", getHighlightById);

// POST (Create)
router.post("/", createHighlight);

// PUT (Update)
router.put("/:id", updateHighlight);

// DELETE
router.delete("/:id", deleteHighlight);

module.exports = router;