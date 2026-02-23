const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const Project = require('./src/models/Project');
const Highlight = require('./src/models/Highlight');

const MONGO_URI = process.env.MONGO_URI;

async function scrapeContent(url) {
  try {
    if (!url || !url.startsWith('https://atuldubey.in/')) return null;
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let contentHtml = $('.col-lg-8').first().html();
    if (!contentHtml) {
      contentHtml = $('.col-md-8').first().html(); // fallback
    }

    if (contentHtml) {
      // Fix image relative paths
      contentHtml = contentHtml.replace(/(?:\.\.\/)+images\//g, 'images/');
      // Remove the first Summary heading
      contentHtml = contentHtml.replace(/<h2[^>]*>Summary<\/h2>/i, '');
      return contentHtml.trim();
    }
    return null;
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
}

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects.`);
    for (let p of projects) {
      const url = p.links && p.links.live ? p.links.live : null;
      if (url) {
        const richHtml = await scrapeContent(url);
        if (richHtml && richHtml.length > 50) {
          p.content = richHtml;
          p.description = richHtml;
          await p.save();
          console.log(`✅ Updated Project: ${p.title}`);
        }
      }
    }

    const highlights = await Highlight.find({});
    console.log(`Found ${highlights.length} highlights.`);
    for (let h of highlights) {
      const url = h.link;
      if (url) {
        const richHtml = await scrapeContent(url);
        if (richHtml && richHtml.length > 50) {
          h.content = richHtml;
          await h.save();
          console.log(`✅ Updated Highlight: ${h.title}`);
        }
      }
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

run();
