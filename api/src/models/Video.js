const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "YouTube URL is required"],
    },
    videoId: {
      type: String, // We will extract this from the URL
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);