const Gallery = require("../models/Gallery");

exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery" });
  }
};

exports.addImage = async (req, res) => {
  try {
    const { title, imageUrl } = req.body; // Ensure this matches the JS payload
    const newImage = await Gallery.create({ title, imageUrl });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: "Error adding image" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};