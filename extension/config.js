const CONFIG = {
    // 🌍 DEPLOYMENT: Replace with your Vercel URL after deployment
    // e.g. 'https://your-feluda-app.vercel.app'
    API_BASE_URL: 'http://localhost:8001'
};

// Expose CONFIG in both content script and service worker scopes
if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof self !== 'undefined') self.CONFIG = CONFIG;
