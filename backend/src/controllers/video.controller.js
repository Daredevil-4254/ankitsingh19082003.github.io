const Video = require("../models/Video");

// --- Helper: Extract YouTube ID ---
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// 1. Get All Videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 2. Create Video
exports.createVideo = async (req, res) => {
  try {
    const { title, url, description } = req.body;
    
    const videoId = extractVideoId(url);
    if (!videoId) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
    }

    const newVideo = await Video.create({ title, url, videoId, description });
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: "Error adding video", error: err.message });
  }
};

// 3. Delete Video
exports.deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};