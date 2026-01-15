const express = require("express");
const router = express.Router();
const controller = require("../../controllers/video.controller");

// 1. PUBLIC GET: Allows the portfolio to fetch YouTube IDs for the carousel
router.get("/", controller.getVideos); 

module.exports = router;