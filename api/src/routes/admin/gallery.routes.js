const express = require("express");
const router = express.Router();
//  Import the new updateImage function
const { 
  getGallery, 
  addImage, 
  deleteImage, 
  updateImage 
} = require("../../controllers/gallery.controller");

router.get("/", getGallery);
router.post("/", addImage);
router.put("/:id", updateImage); //  New route for editing
router.delete("/:id", deleteImage);

module.exports = router;