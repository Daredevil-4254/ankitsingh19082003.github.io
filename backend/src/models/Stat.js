const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    value: {
      type: String, // e.g., "5000+"
      required: [true, "Value is required"],
      trim: true,
    },
    label: {
      type: String, // e.g., "PEOPLE TRAINED AND MENTORED"
      required: [true, "Label is required"],
      trim: true,
    },
    icon: {
      type: String, // Base64 string or URL for the circular icon
      default: "",
    },
    order: {
      type: Number, // To arrange them exactly like the screenshot
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stat", statSchema);