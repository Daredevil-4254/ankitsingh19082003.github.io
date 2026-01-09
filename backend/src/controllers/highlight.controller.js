const Highlight = require("../models/Highlight");
const { applyHighlightVisibility } = require("../services/visibility.service");

const getPublicHighlights = async (req, res, next) => {
  try {
    const visibilityQuery = await applyHighlightVisibility();
    const highlights = await Highlight.find(visibilityQuery)
      .sort({ priority: 1, createdAt: -1 })
      .populate("media");

    res.json(highlights);
  } catch (err) {
    next(err);
  }
};

const createHighlight = async (req, res, next) => {
  try {
    const highlight = await Highlight.create(req.body);
    res.status(201).json(highlight);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicHighlights,
  createHighlight,
};
