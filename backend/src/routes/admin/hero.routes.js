const express = require("express");
const router = express.Router();
const { getHero, updateHero } = require("../../controllers/hero.controller");

router.get("/", getHero);
router.post("/", updateHero); // We use POST to handle both create and update

module.exports = router;