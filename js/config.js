// js/config.js
const CONFIG = {
    // If running locally, point to local backend port 5050.
    // Otherwise, point explicitly to the Vercel backend since the frontend is hosted on GitHub Pages
    API_BASE: window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
        ? 'http://localhost:5050/api' 
        : 'https://atul-dubey-github-io.vercel.app/api'
};

// Made it available globally
window.portfolioConfig = CONFIG;