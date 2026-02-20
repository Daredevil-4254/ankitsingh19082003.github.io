// TEMPORARY SETUP ENDPOINT - DELETE AFTER USE
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Inline Admin model to avoid path issues
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = async (req, res) => {
  // Only allow GET with secret key for safety
  const { secret } = req.query;
  if (secret !== 'setup-atul-2024') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await connectDB();
    const passwordHash = await bcrypt.hash('admin123', 10);
    const result = await Admin.findOneAndUpdate(
      { username: 'admin' },
      { username: 'admin', passwordHash },
      { upsert: true, new: true }
    );
    res.json({
      success: true,
      message: 'Admin user created/reset with password admin123',
      username: result.username
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
