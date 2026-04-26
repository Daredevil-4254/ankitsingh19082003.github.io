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
// hero.controller.js
exports.updateHero = async (req, res) => {
  try {
    // Destructure everything including the socialLinks object sent by admin.js
    const { greeting, name, subtitle, description, image, resumeLink, socialLinks } = req.body;

    const heroData = {
      greeting,
      name,
      subtitle,
      description,
      resumeLink,
      // Correctly map the nested object from the request
      socialLinks: { 
        linkedin: socialLinks?.linkedin || "", 
        github: socialLinks?.github || "", 
        twitter: socialLinks?.twitter || "" 
      }
    };

    if (image && image.length > 100) {
      heroData.image = image;
    }

    const updatedHero = await Hero.findOneAndUpdate(
      {}, 
      { $set: heroData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedHero);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};