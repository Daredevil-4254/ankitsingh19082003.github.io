const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    greeting: { type: String, default: "Hi, I am" }, // e.g., "Hi, I am"
    name: { type: String, required: true },          // e.g., "Ankit Singh"
    subtitle: { type: String },                      // e.g., "IoT Developer & C++ Enthusiast"
    description: { type: String },                   // Short bio
    image: { type: String, default: "" },            // Your photo (Base64)
    resumeLink: { type: String, default: "" },       // Link to Google Drive PDF or similar
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);