const express = require("express");
const router = express.Router();
const controller = require("../../controllers/gallery.controller");

router.get("/", controller.getGallery); 

module.exports = router; 