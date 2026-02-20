const Stat = require("../models/Stat");

// 1. Get All Stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 2. Create Stat
exports.createStat = async (req, res) => {
  try {
    const { value, label, icon, order } = req.body;
    const newStat = await Stat.create({ value, label, icon, order });
    res.status(201).json(newStat);
  } catch (err) {
    res.status(400).json({ message: "Error creating stat", error: err.message });
  }
};

// 3. Update Stat
exports.updateStat = async (req, res) => {
  try {
    const { value, label, icon, order } = req.body;
    const updates = { value, label, order };

    // Update icon if provided
    if (icon) {
      updates.icon = icon;
    }

    const updatedStat = await Stat.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.status(200).json(updatedStat);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// 4. Delete Stat
exports.deleteStat = async (req, res) => {
  try {
    await Stat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 5. Get Single Stat
exports.getStatById = async (req, res) => {
  try {
    const stat = await Stat.findById(req.params.id);
    if (!stat) return res.status(404).json({ message: "Stat not found" });
    res.status(200).json(stat);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};