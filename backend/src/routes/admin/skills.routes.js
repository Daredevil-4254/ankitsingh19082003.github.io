const express = require("express");
const router = express.Router();
const { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill, 
  getSkillById 
} = require("../../controllers/skill.controller");

router.get("/", getSkills);
router.post("/", createSkill);
router.get("/:id", getSkillById);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

module.exports = router;