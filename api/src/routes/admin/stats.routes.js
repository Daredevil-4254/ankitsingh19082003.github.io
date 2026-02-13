const express = require("express");
const router = express.Router();
const { 
  getStats, 
  createStat, 
  updateStat, 
  deleteStat, 
  getStatById 
} = require("../../controllers/stat.controller");

router.get("/", getStats);
router.post("/", createStat);
router.get("/:id", getStatById);
router.put("/:id", updateStat);
router.delete("/:id", deleteStat);

module.exports = router;