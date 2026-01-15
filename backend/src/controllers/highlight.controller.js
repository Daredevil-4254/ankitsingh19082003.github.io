const Highlight = require("../models/Highlight");

// --- Helper: Parse Tags ---
// Handles "tag1, tag2" string OR ["tag1", "tag2"] array
const parseTags = (tagInput) => {
  if (!tagInput) return [];
  if (Array.isArray(tagInput)) return tagInput; 
  
  // Check for stringified array '["a", "b"]'
  if (typeof tagInput === 'string' && tagInput.trim().startsWith('[')) {
    try {
      return JSON.parse(tagInput);
    } catch (e) {
      // ignore error, fall through to split
    }
  }
  // Fallback: Comma separated string
  return tagInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
};

// --- 1. Get All Highlights ---
const getHighlights = async (req, res) => {
  try {
    // Sort by Event Date (newest first), then Created Date
    const highlights = await Highlight.find()
      .sort({ eventDate: -1, createdAt: -1 });
    res.status(200).json(highlights);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- 2. Get Single Highlight ---
const getHighlightById = async (req, res) => {
  try {
    const highlight = await Highlight.findById(req.params.id);
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    res.status(200).json(highlight);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- 3. Create Highlight ---
const createHighlight = async (req, res) => {
  try {
    // 1. Destructure fields from text body
    // Note: We use 'content' here because that's what your Schema expects
    const { 
      title, 
      content, 
      category, 
      status, 
      venue, 
      link, 
      eventDate 
    } = req.body;

    // 2. Handle Files (if Multer is working)
    // If you haven't set up Multer yet, these will just be ignored/empty
    let imagePath = "";
    if (req.files && req.files['poster'] && req.files['poster'][0]) {
      imagePath = req.files['poster'][0].path; // or .location for S3
    }
    // Fallback: If frontend sent a URL string instead of a file
    else if (req.body.image) {
      imagePath = req.body.image;
    }

    let galleryPaths = [];
    if (req.files && req.files['gallery']) {
      galleryPaths = req.files['gallery'].map(f => f.path);
    }

    // 3. Create Data Object
    const highlightData = {
      title,
      content, // Mapped from frontend 'content'
      category,
      status,
      venue,
      link,
      tags: parseTags(req.body.tags),
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      image: imagePath,
      gallery: galleryPaths
    };

    const newHighlight = await Highlight.create(highlightData);
    res.status(201).json(newHighlight);

  } catch (err) {
    console.error("Create Error:", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// --- 4. Update Highlight ---
const updateHighlight = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Highlight.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Highlight not found" });
    }

    const updates = {};

    // Standard Fields
    if (req.body.title) updates.title = req.body.title;
    if (req.body.content) updates.content = req.body.content;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.status) updates.status = req.body.status;
    if (req.body.venue) updates.venue = req.body.venue;
    if (req.body.link) updates.link = req.body.link;
    if (req.body.eventDate) updates.eventDate = new Date(req.body.eventDate);
    if (req.body.tags) updates.tags = parseTags(req.body.tags);

    // Image Logic
    if (req.files && req.files['poster'] && req.files['poster'][0]) {
      updates.image = req.files['poster'][0].path;
    } else if (req.body.image) {
      updates.image = req.body.image;
    }

    // Gallery Logic (Merge old + new)
    let keptImages = [];
    if (req.body.gallery) {
       // If it's a string (one url), make it array. If array, keep it.
       keptImages = Array.isArray(req.body.gallery) ? req.body.gallery : [req.body.gallery];
    }
    
    let newImages = [];
    if (req.files && req.files['gallery']) {
      newImages = req.files['gallery'].map(f => f.path);
    }

    // Only update gallery if we have new info
    if (req.body.gallery || newImages.length > 0) {
      updates.gallery = [...keptImages, ...newImages];
    }

    const updatedHighlight = await Highlight.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedHighlight);

  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// --- 5. Delete Highlight ---
const deleteHighlight = async (req, res) => {
  try {
    const deleted = await Highlight.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getHighlights,
  getHighlightById, 
  createHighlight,
  updateHighlight,
  deleteHighlight,
};