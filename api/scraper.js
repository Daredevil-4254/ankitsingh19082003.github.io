const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const Project = require('./src/models/Project');
const Highlight = require('./src/models/Highlight');

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

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = async (req, res) => {
  // Basic protection
  if (req.query.secret !== 'scrape-secure-2024') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await connectDB();
    let logs = [];
    logs.push("Fetching from DB...");

    const projects = await Project.find({});
    for (let p of projects) {
      const url = p.links && p.links.live ? p.links.live : null;
      if (url) {
        const richHtml = await scrapeContent(url);
        if (richHtml && richHtml.length > 50) {
          p.content = richHtml;
          p.description = richHtml;
          await p.save();
          logs.push(`✅ Updated Project: ${p.title}`);
        }
      }
    }

    const highlights = await Highlight.find({});
    for (let h of highlights) {
      const url = h.link;
      if (url) {
        const richHtml = await scrapeContent(url);
        if (richHtml && richHtml.length > 50) {
          h.content = richHtml;
          await h.save();
          logs.push(`✅ Updated Highlight: ${h.title}`);
        }
      }
    }

    res.json({ success: true, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
