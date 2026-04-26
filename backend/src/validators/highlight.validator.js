const { HIGHLIGHT_STATUS } = require("../utils/enums");

module.exports = (req, res, next) => {
  const { title, summary, category, status, priority } = req.body;

  if (!title || !summary || !category || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!Object.values(HIGHLIGHT_STATUS).includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  if (priority !== undefined && typeof priority !== "number") {
    return res.status(400).json({ error: "Priority must be a number" });
  }

  next();
};
