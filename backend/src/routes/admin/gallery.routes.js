const express = require("express");
const router = express.Router();
const { getGallery, addImage, deleteImage } = require("../../controllers/gallery.controller");

// These now have 'router' defined above
router.get("/", getGallery);
router.post("/", addImage);
router.delete("/:id", deleteImage);

module.exports = router;