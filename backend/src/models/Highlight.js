const mongoose = require("mongoose");
// Ensure this path matches your project structure
const { HIGHLIGHT_STATUS, ROLES, CATEGORIES } = require("../utils/enums"); 

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // Content matches your controller logic
    content: { type: String, required: true, maxlength: 2000 }, 
    category: {
      type: String,
      enum: Object.values(CATEGORIES), 
      required: true,
      default: CATEGORIES.PROJECT
    },
    status: {
      type: String,
      enum: Object.values(HIGHLIGHT_STATUS),
      default: HIGHLIGHT_STATUS.PUBLISHED,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PRIMARY,
    },
    venue: { type: String, trim: true },
    
    // Changed to simple [String] to prevent subdocument creation
    tags: { type: [String], default: [] }, 
    
    eventDate: { type: Date, default: Date.now },
    link: { type: String, trim: true },
    
    // --- IMAGES SECTION ---
    image: { type: String, trim: true }, // Main Poster

    // Changed to simple [String] for better array handling
    gallery: { type: [String], default: [] }, 

    priority: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Highlight", highlightSchema);