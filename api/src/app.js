const express = require("express");
const cors = require("cors");
const path = require("path");
const requireAuth = require("./middlewares/auth.middleware");
// Route Imports
const authRoutes = require("./routes/admin/auth.routes");
const publicGalleryRoutes = require("./routes/public/gallery.routes");
const adminGalleryRoutes = require("./routes/admin/gallery.routes");
const publicVideoRoutes = require("./routes/public/videos.routes");
const adminVideoRoutes = require("./routes/admin/video.routes");
const publicProjectRoutes = require("./routes/public/projects.routes");
const adminProjectRoutes = require("./routes/admin/projects.routes");

const app = express();

// 1. GLOBAL MIDDLEWARE
// Set limits BEFORE routes to handle Base64 gallery uploads
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ limit: "4mb", extended: true }));

// Simplified CORS: Browser origins only need the domain/protocol, not the specific folder path.
app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'https://ankitsingh19082003.github.io',
        'https://daredevil-4254.github.io',
        'https://atul-dubey-github-io.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// 2. STATIC FOLDERS
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 3. PUBLIC ROUTES (No Token Required)
app.use("/api/public/hero", require("./routes/public/hero.routes"));
app.use("/api/public/stats", require("./routes/public/stats.routes"));
app.use("/api/public/skills", require("./routes/public/skills.routes"));
app.use("/api/public/highlights", require("./routes/public/highlights.routes"));
app.use("/api/public/projects", publicProjectRoutes);
app.use("/api/public/videos", publicVideoRoutes);
app.use("/api/public/gallery", publicGalleryRoutes);

// 4. ADMIN ROUTES (Token Required)
app.use("/api/admin", authRoutes);
app.use("/api/admin/hero", requireAuth, require("./routes/admin/hero.routes"));
app.use("/api/admin/stats", requireAuth, require("./routes/admin/stats.routes"));
app.use("/api/admin/skills", requireAuth, require("./routes/admin/skills.routes"));
app.use("/api/admin/highlights", requireAuth, require("./routes/admin/highlights.routes"));
app.use("/api/admin/projects", requireAuth, adminProjectRoutes);
app.use("/api/admin/videos", requireAuth, adminVideoRoutes);
app.use("/api/admin/gallery", requireAuth, adminGalleryRoutes);

// 5. HEALTH CHECK
app.get("/api/health", (_, res) => res.json({ status: "ok" }));



module.exports = app;