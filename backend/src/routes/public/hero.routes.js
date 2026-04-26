const express = require("express");
const router = express.Router();
const controller = require("../../controllers/hero.controller");

// 1. PUBLIC GET: No 'auth' needed, so Atul Sir's visitors can see the data
router.get("/", controller.getHero); 

// 2. NOTE: The PUT route (Update) should ONLY be in your routes/admin/hero.routes.js

module.exports = router;