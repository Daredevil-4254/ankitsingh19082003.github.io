const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    alt: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
