const express = require("express");
const router = express.Router();
const controller = require("../../controllers/project.controller");
const auth = require("../../middlewares/auth.middleware");

// Admin Read (Useful for the Dashboard list)
router.get("/", auth, controller.getProjects); 

// Private Write Operations (Protected)
router.post("/", auth, controller.createProject);
router.put("/:id", auth, controller.updateProject);
router.delete("/:id", auth, controller.deleteProject);

module.exports = router;