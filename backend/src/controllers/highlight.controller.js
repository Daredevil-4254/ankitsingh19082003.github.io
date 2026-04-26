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
      // fall through to split
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
    console.error("Get Highlights Error:", err);
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
    console.error("Get Highlight ID Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// --- 3. Create Highlight ---
const createHighlight = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      category, 
      status, 
      venue, 
      link, 
      eventDate 
    } = req.body;

    // Handle Poster Image (Safe Access)
    let imagePath = "";
    if (req.files?.['poster']?.[0]) {
      imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.files['poster'][0].filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    // Handle Gallery Images
    let galleryPaths = [];
    if (req.files?.['gallery']) {
      galleryPaths = req.files['gallery'].map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
    }

    const highlightData = {
      title,
      content, 
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
    console.error("Create Highlight Error:", err);
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
    if (req.body.title) updates.title = req.body.title;
    if (req.body.content) updates.content = req.body.content;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.status) updates.status = req.body.status;
    if (req.body.venue) updates.venue = req.body.venue;
    if (req.body.link) updates.link = req.body.link;
    if (req.body.eventDate) updates.eventDate = new Date(req.body.eventDate);
    
    // Handle Tags
    if (req.body.tags !== undefined) {
      updates.tags = parseTags(req.body.tags);
    }

    // Update Poster Image
    if (req.files?.['poster']?.[0]) {
      updates.image = `${req.protocol}://${req.get('host')}/uploads/${req.files['poster'][0].filename}`;
    } else if (req.body.image) {
      updates.image = req.body.image;
    }

    // --- Gallery Update (Critical Fixes) ---
    // 1. Handle Kept Images (Existing URLs sent from frontend)
    let keptImages = [];
    if (req.body.gallery) {
       // Ensure we handle both single string and array of strings
       const rawGallery = Array.isArray(req.body.gallery) ? req.body.gallery : [req.body.gallery];
       // Filter out empty strings if any
       keptImages = rawGallery.filter(img => img && img.trim() !== "");
    }
    
    // 2. Handle New Uploaded Images
    let newImages = [];
    if (req.files?.['gallery']) {
      newImages = req.files['gallery'].map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
    }

    // 3. Merge: If we have kept images OR new images, update the field.
    // Note: If you want to delete ALL images, the frontend should send an empty gallery array or we might need specific logic.
    // Currently, this updates if there is at least one image to set.
    if (keptImages.length > 0 || newImages.length > 0) {
      updates.gallery = [...keptImages, ...newImages];
    } else if (req.body.gallery === "") {
        // Explicit clear if frontend sent empty string for gallery
        updates.gallery = [];
    }

    const updatedHighlight = await Highlight.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedHighlight);

  } catch (err) {
    console.error("Update Highlight Error:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// --- 5. Delete Highlight ---
const deleteHighlight = async (req, res) => {
  try {
    const deleted = await Highlight.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
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