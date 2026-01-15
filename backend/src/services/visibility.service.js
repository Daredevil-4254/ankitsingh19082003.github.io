const Settings = require("../models/Settings");
console.log("DEBUG Settings import:", Settings);


const applyHighlightVisibility = async () => {
  const settings = await Settings.findOne();

  if (!settings) {
    return { visible: true };
  }

  if (settings.showDraftHighlights) {
    return {};
  }

  return { status: "Published", visible: true };
};

module.exports = { applyHighlightVisibility };
