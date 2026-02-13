const express = require('express');
const router = express.Router();
const Project = require('../../models/Project');

// POST a new project
router.post('/add', async (req, res) => {
    const project = new Project({
        title: req.body.title,
        category: req.body.category, // e.g., 'iot', 'research'
        image: req.body.image,
        description: req.body.description
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: "Error saving project" });
    }
});

module.exports = router;