// js/config.js
const CONFIG = {
    // Dynamically uses the current domain for Vercel/localhost, otherwise fall back to the Vercel production API
    API_BASE: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('vercel.app'))
        ? window.location.origin + '/api'
        : 'https://atul-dubey-github-io.vercel.app/api'
};

// Made it available globally
window.portfolioConfig = CONFIG;