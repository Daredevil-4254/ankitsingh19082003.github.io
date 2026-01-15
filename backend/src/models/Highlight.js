const mongoose = require("mongoose");
const { HIGHLIGHT_STATUS, ROLES, CATEGORIES } = require("../utils/enums");

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // Renamed from summary to content to match your controller req.body.content
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
    tags: [{ type: String, trim: true }],
    eventDate: { type: Date, default: Date.now },
    link: { type: String, trim: true },
    
    // --- IMAGES SECTION (MATCHES FRONTEND) ---
    // Renamed to 'image' to match admin.js payload
    image: { type: String, trim: true }, 

    // Renamed to 'gallery' to match admin.js payload
    gallery: [{ type: String, trim: true }],

    priority: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Highlight", highlightSchema);
