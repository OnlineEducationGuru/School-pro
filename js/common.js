// Online Education Guru - Common Functions

// Disable right-click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable keyboard shortcuts for copying
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || 
                       e.key === 'u' || e.key === 'U' ||
                       e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
    }
    // Disable F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
});

// Navigation function
function navigateTo(url) {
    window.location.href = url;
}

// Show loading
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">લોડ થઈ રહ્યું છે...</div>';
    }
}

// Hide loading
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const loading = element.querySelector('.loading');
        if (loading) loading.remove();
    }
}

// Show error message
function showError(message, elementId = null) {
    const errorHTML = `<div class="error-message">${message}</div>`;
    if (elementId) {
        document.getElementById(elementId).innerHTML = errorHTML;
    } else {
        alert(message);
    }
}

// Show success message
function showSuccess(message, elementId = null) {
    const successHTML = `<div class="success-message">${message}</div>`;
    if (elementId) {
        document.getElementById(elementId).innerHTML = successHTML;
    } else {
        alert(message);
    }
}

// Fetch data from Google Sheets
async function fetchData(endpoint, params = {}) {
    try {
        const url = new URL(endpoint);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Post data to Google Sheets
async function postData(endpoint, data) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting data:', error);
        return null;
    }
}

// Format date in Gujarati
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('gu-IN', options);
}

// Validate mobile number
function validateMobile(mobile) {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get user from localStorage
function getUser() {
    const userStr = localStorage.getItem('oeg_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Save user to localStorage
function saveUser(user) {
    localStorage.setItem('oeg_user', JSON.stringify(user));
}

// Logout user
function logoutUser() {
    localStorage.removeItem('oeg_user');
    navigateTo('../index.html');
}

// Check if user is logged in
function isLoggedIn() {
    return getUser() !== null;
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});
