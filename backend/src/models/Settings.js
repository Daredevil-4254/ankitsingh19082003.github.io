const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    showDraftHighlights: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
