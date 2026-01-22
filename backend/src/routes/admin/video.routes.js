const express = require("express");
const router = express.Router();

const { 
  getVideos, 
  createVideo, 
  deleteVideo, 
  updateVideo 
} = require("../../controllers/video.controller");

router.get("/", getVideos);
router.post("/", createVideo);
router.patch("/:id", updateVideo);
router.delete("/:id", deleteVideo);

module.exports = router;