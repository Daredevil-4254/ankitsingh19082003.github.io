const Hero = require("../models/Hero");

// 1. Get Hero Data
exports.getHero = async (req, res) => {
  try {
    // We always just fetch the first document found
    const hero = await Hero.findOne();
    // If no hero exists yet, return an empty object (not an error)
    res.status(200).json(hero || {});
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 2. Update (or Create) Hero Data
exports.updateHero = async (req, res) => {
  try {
    const { greeting, name, subtitle, description, image, resumeLink, linkedin, github, twitter } = req.body;

    const heroData = {
      greeting,
      name,
      subtitle,
      description,
      resumeLink,
      socialLinks: { linkedin, github, twitter }
    };

    // Only update image if a new one is sent
    if (image && image.length > 100) {
      heroData.image = image;
    }

    // "findOneAndUpdate" with upsert: true means "Create if not found"
    const updatedHero = await Hero.findOneAndUpdate(
      {}, // Filter (empty means match anything)
      { $set: heroData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedHero);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};