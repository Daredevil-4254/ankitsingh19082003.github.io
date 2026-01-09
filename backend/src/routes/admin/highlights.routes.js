const express = require("express");
const router = express.Router();
const { createHighlight } = require("../../controllers/highlight.controller");
const validateHighlight = require("../../validators/highlight.validator");

router.post("/", validateHighlight, createHighlight);

module.exports = router;
