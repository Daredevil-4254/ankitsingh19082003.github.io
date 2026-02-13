const express = require("express");
const router = express.Router();
const controller = require("../../controllers/stat.controller");

// REMOVED: auth middleware import to fix the crash

// PUBLIC: Only provide the GET route here
router.get("/", controller.getStats);

module.exports = router;