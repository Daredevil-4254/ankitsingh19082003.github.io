require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Highlight = require("../src/models/Highlight");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const filePath = path.join(__dirname, "../../data/highlights.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const items = JSON.parse(raw);

    for (const item of items) {
      await Highlight.create({
        title: item.title,
        summary: item.summary,
        category: item.category || "General",
        status: item.status
          ? item.status.charAt(0).toUpperCase() +
            item.status.slice(1).toLowerCase()
          : "Published",
        priority: item.priority || 0,
        visible: item.visible !== false,
      });
    }

    console.log("Migration complete");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
