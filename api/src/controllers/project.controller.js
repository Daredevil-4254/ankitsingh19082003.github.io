const Project = require("../models/Project");

// --- Helper: Clean Array Strings ---
const parseTech = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input.split(',').map(t => t.trim()).filter(t => t.length > 0);
};

// --- Helper: Generate Slug ---
const generateSlug = (title) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, "") // Remove special chars
    .replace(/ +/g, "-");    // Replace spaces with dashes
};

// 1. Get All Projects (Updated for Filtering)
exports.getProjects = async (req, res) => {
  try {
    // Look for ?category=... in the URL
    const { category } = req.query;
    let filter = {};

    // Only apply the filter if a specific category is requested
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Execute the query with the dynamic filter
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 2. Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 3. Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, category, technologies, summary, description, link, image } = req.body;

    const newProject = await Project.create({
      title,
      slug: generateSlug(title),
      category,
      technologies: parseTech(technologies),
      summary,
      description,
      thumbnail: image,
      links: { live: link }
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// 4. Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, category, technologies, summary, description, link, image } = req.body;

    const updates = {
      title,
      category,
      technologies: parseTech(technologies),
      summary,
      description,
      "links.live": link
    };

    if (title) {
      updates.slug = generateSlug(title);
    }

    if (image) {
      updates.thumbnail = image;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProject) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(updatedProject);
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// 5. Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};