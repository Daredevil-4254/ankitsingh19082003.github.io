const Settings = require("../models/Settings");

const applyHighlightVisibility = async (query = {}) => {
  const settings = await Settings.findOne();
  const allowedStatuses =
    settings?.visibilityRules?.highlights || ["Published"];

  return {
    ...query,
    status: { $in: allowedStatuses },
    visible: true,
  };
};

module.exports = {
  applyHighlightVisibility,
};
