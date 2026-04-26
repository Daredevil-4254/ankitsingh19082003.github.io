const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project Title is required"], 
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      // We will generate this in the controller now
    },
    category: {
      type: String,
      required: true,
      default: "Other" 
    },
    summary: {
      type: String,
      default: "",
      maxLength: 1000,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String, 
      default: "",
    },
    images: {
      type: [String], 
      default: [],
    },
    technologies: {
      type: [String], 
      default: [],
    },
    links: {
      github: { type: String, default: "" },
      live: { type: String, default: "" },
      paper: { type: String, default: "" },
      video: { type: String, default: "" },
    },
    order: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);