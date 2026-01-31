const express = require('express');
const router = express.Router();
const Project = require('../../models/Project'); // Adjust path to your model

// GET projects with optional category filtering
router.get('/', async (req, res) => {
    try {
        const { category } = req.query; 
        let filter = {};

        // If a category is sent (e.g., ?category=iot), filter the results
        if (category && category !== 'all') {
            filter.category = category; 
        }

        const projects = await Project.find(filter).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching projects" });
    }
});

module.exports = router;