const Gallery = require("../models/Gallery");

// 1. Get all images
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery" });
  }
};

// 2. Add New Image(s)
exports.addImage = async (req, res) => {
  try {
    //  Using 'image' (singular) to match Model, 'images' (plural) for batch logic
    const { title, image, images } = req.body;

    // Batch Upload Logic
    if (images && Array.isArray(images) && images.length > 0) {
      const createdImages = await Promise.all(
        images.map(imgData => Gallery.create({ title, image: imgData }))
      );
      return res.status(201).json(createdImages);
    }

    // Single Upload Logic
    if (!image) {
      return res.status(400).json({ message: "Image data is required" });
    }

    const newImage = await Gallery.create({ title, image });
    res.status(201).json(newImage);
  } catch (err) {
    console.error("Upload Error:", err); // Log for debugging
    res.status(400).json({ message: "Error adding image(s)", error: err.message });
  }
};

// 3. Update existing image
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image } = req.body;

    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      { title, image },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json(updatedImage);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// 4. Delete image
exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};