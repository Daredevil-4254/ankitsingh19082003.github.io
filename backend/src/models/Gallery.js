const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Can be Base64 or a URL
  category: { type: String, default: "General" }
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);