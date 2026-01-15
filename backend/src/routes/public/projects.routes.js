const express = require("express");
const router = express.Router();
const { 
  getProjects, 
  getProjectById 
} = require("../../controllers/project.controller");

// Supports the public category filtering for Atul Sir's site
router.get("/", getProjects); 
router.get("/:id", getProjectById);

module.exports = router;