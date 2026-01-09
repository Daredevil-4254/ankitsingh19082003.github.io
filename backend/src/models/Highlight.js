const mongoose = require("mongoose");
const { HIGHLIGHT_STATUS, ROLES } = require("../utils/enums");

const highlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 300,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(HIGHLIGHT_STATUS),
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PRIMARY,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
    priority: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Highlight", highlightSchema);
