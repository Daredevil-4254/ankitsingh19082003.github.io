const express = require("express");
const router = express.Router();
const { getVideos, createVideo, deleteVideo } = require("../../controllers/video.controller");

router.get("/", getVideos);
router.post("/", createVideo);
router.delete("/:id", deleteVideo);

module.exports = router;