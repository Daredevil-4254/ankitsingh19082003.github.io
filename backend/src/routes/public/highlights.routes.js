const express = require("express");
const router = express.Router();
const {
  getPublicHighlights,
} = require("../../controllers/highlight.controller");

router.get("/", getPublicHighlights);

module.exports = router;
