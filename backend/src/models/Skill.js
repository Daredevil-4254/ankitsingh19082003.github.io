const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String, // e.g., "Robotics"
      required: [true, "Skill title is required"],
      trim: true,
    },
    description: {
      type: String, // e.g., "ROS, Industrial Robots, Drones"
      required: [true, "Description is required"],
      trim: true,
    },
    icon: {
      type: String, // Base64 image
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);