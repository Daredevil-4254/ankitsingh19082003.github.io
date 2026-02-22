// js/config.js
const CONFIG = {
    // Dynamically uses the current domain — works on all Vercel preview URLs and localhost
    API_BASE: window.location.origin + '/api'
};

// Made it available globally
window.portfolioConfig = CONFIG;