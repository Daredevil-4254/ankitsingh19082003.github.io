const express = require("express");
const router = express.Router();
const controller = require("../../controllers/skill.controller");

// 1. PUBLIC GET: Allows the main website to see the skills list
router.get("/", controller.getSkills); 

module.exports = router;