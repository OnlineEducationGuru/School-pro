// Online Education Guru - Configuration File

// Google Sheets Configuration
const CONFIG = {
    // Replace with your actual Google Apps Script Web App URL
    SHEETS_API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    
    // Site Configuration
    SITE_NAME: 'Online Education Guru',
    SITE_LOGO: 'images/logo.png',
    FAVICON: 'favicon.ico',
    
    // Google AdSense
    ADSENSE_CLIENT: 'ca-pub-XXXXXXXXXX',
    
    // Features Toggle
    FEATURES: {
        NEWS_TICKER: true,
        LEADERBOARD: true,
        REGISTRATION: true,
        QUIZ: true
    },
    
    // Quiz Settings
    QUIZ: {
        DEFAULT_QUESTIONS: 10,
        TIME_PER_QUESTION: 30, // seconds
        PASSING_PERCENTAGE: 40
    }
};

// API Endpoints
const API_ENDPOINTS = {
    GET_NEWS: CONFIG.SHEETS_API_URL + '?action=getNews',
    GET_LEADERBOARD: CONFIG.SHEETS_API_URL + '?action=getLeaderboard',
    GET_TOOLS: CONFIG.SHEETS_API_URL + '?action=getTools',
    GET_MATERIALS: CONFIG.SHEETS_API_URL + '?action=getMaterials',
    GET_QUIZ: CONFIG.SHEETS_API_URL + '?action=getQuiz',
    SUBMIT_QUIZ: CONFIG.SHEETS_API_URL + '?action=submitQuiz',
    REGISTER_USER: CONFIG.SHEETS_API_URL + '?action=registerUser',
    LOGIN_USER: CONFIG.SHEETS_API_URL + '?action=loginUser',
    GET_USER_SCORE: CONFIG.SHEETS_API_URL + '?action=getUserScore',
    ADMIN_LOGIN: CONFIG.SHEETS_API_URL + '?action=adminLogin',
    UPDATE_SETTINGS: CONFIG.SHEETS_API_URL + '?action=updateSettings'
};
