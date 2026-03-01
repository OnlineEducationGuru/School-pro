// Admin Panel JavaScript

let isAdminLoggedIn = false;

// Check login on load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    setupAdminForms();
});

// Check if admin is logged in
function checkAdminLogin() {
    const adminSession = sessionStorage.getItem('admin_session');
    if (adminSession) {
        isAdminLoggedIn = true;
        showDashboard();
    }
}

// Admin login form
document.getElementById('adminLoginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const response = await postData(API_ENDPOINTS.ADMIN_LOGIN, {
            action: 'adminLogin',
            username: username,
            password: password
        });
        
        if (response && response.success) {
            sessionStorage.setItem('admin_session', 'true');
            isAdminLoggedIn = true;
            showDashboard();
        } else {
            showLoginMessage('Invalid credentials', 'error');
        }
    } catch (error) {
        showLoginMessage('Login failed', 'error');
    }
});

// Show dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadNews();
}

// Show login message
function showLoginMessage(message, type) {
    const msgDiv = document.getElementById('loginMessage');
    msgDiv.textContent = message;
    msgDiv.className = type === 'success' ? 'success-msg' : 'error-msg';
}

// Logout
function logout() {
    sessionStorage.removeItem('admin_session');
    location.reload();
}

// Show tab
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// Setup admin forms
function setupAdminForms() {
    // News form
    document.getElementById('newsForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await addNews();
    });
    
    // Tool upload form
    document.getElementById('toolUploadForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await uploadTool();
    });
    
    // Material form
    document.getElementById('materialForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await addMaterial();
    });
    
    // Game upload form
    document.getElementById('gameUploadForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await uploadGame();
    });
    
    // Settings form
    document.getElementById('settingsForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveSettings();
    });
}

// Add news
async function addNews() {
    const title = document.getElementById('newsTitle').value;
    const link = document.getElementById('newsLink').value;
    
    try {
        const response = await postData(API_ENDPOINTS.ADD_NEWS || API_ENDPOINTS.ADMIN_LOGIN, {
            action: 'addNews',
            title: title,
            link: link
        });
        
        if (response && response.success) {
            alert('News added successfully!');
            document.getElementById('newsForm').reset();
            loadNews();
        }
    } catch (error) {
        alert('Failed to add news');
    }
}

// Load news
async function loadNews() {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;
    
    try {
        const response = await fetchData(API_ENDPOINTS.GET_NEWS);
        
        if (response && response.success && response.news) {
            displayNewsList(response.news);
        } else {
            newsList.innerHTML = '<p>No news available</p>';
        }
    } catch (error) {
        newsList.innerHTML = '<p>Failed to load news</p>';
    }
}

// Display news list
function displayNewsList(newsItems) {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '';
    
    newsItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <div class="news-item-content">
                <div class="news-item-title">${item.title}</div>
                ${item.link ? `<div class="news-item-link">${item.link}</div>` : ''}
            </div>
            <div class="news-item-actions">
                <button class="btn-delete" onclick="deleteNews('${item.id}')">Delete</button>
            </div>
        `;
        newsList.appendChild(div);
    });
}

// Delete news
async function deleteNews(id) {
    if (!confirm('Delete this news?')) return;
    
    // Implement delete functionality
    alert('Delete functionality - connect to backend');
}

// Upload tool
async function uploadTool() {
    const type = document.getElementById('toolType').value;
    const name = document.getElementById('toolName').value;
    const file = document.getElementById('toolFile').files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    // Read file content
    const reader = new FileReader();
    reader.onload = async function(e) {
        const fileName = file.name;
        
        try {
            const response = await postData(API_ENDPOINTS.ADD_TOOL || API_ENDPOINTS.ADMIN_LOGIN, {
                action: 'addTool',
                type: type,
                name: name,
                fileName: fileName,
                fileContent: e.target.result
            });
            
            if (response && response.success) {
                alert('Tool uploaded successfully! Please manually upload the HTML file to /tools/' + type + '/ folder');
                document.getElementById('toolUploadForm').reset();
            }
        } catch (error) {
            alert('Upload failed');
        }
    };
    reader.readAsText(file);
}

// Add material
async function addMaterial() {
    const data = {
        action: 'addMaterial',
        standard: document.getElementById('materialStandard').value,
        type: document.getElementById('materialType').value,
        subject: document.getElementById('materialSubject').value,
        title: document.getElementById('materialTitle').value,
        link: document.getElementById('materialLink').value
    };
    
    try {
        const response = await postData(API_ENDPOINTS.ADD_MATERIAL || API_ENDPOINTS.ADMIN_LOGIN, data);
        
        if (response && response.success) {
            alert('Material added successfully!');
            document.getElementById('materialForm').reset();
        }
    } catch (error) {
        alert('Failed to add material');
    }
}

// Upload game
async function uploadGame() {
    const subject = document.getElementById('gameSubject').value;
    const title = document.getElementById('gameTitle').value;
    const file = document.getElementById('gameFile').files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const fileName = file.name;
    
    try {
        const response = await postData(API_ENDPOINTS.ADD_GAME || API_ENDPOINTS.ADMIN_LOGIN, {
            action: 'addGame',
            subject: subject,
            title: title,
            fileName: fileName
        });
        
        if (response && response.success) {
            alert('Game uploaded successfully! Please manually upload the HTML file to /games/ folder');
            document.getElementById('gameUploadForm').reset();
        }
    } catch (error) {
        alert('Upload failed');
    }
}

// Save settings
async function saveSettings() {
    const settings = {
        logo: document.getElementById('logoUrl').value,
        favicon: document.getElementById('faviconUrl').value,
        siteTitle: document.getElementById('siteTitle').value
    };
    
    try {
        for (const [key, value] of Object.entries(settings)) {
            await postData(API_ENDPOINTS.UPDATE_SETTINGS, {
                action: 'updateSettings',
                key: key,
                value: value
            });
        }
        
        alert('Settings saved successfully!');
    } catch (error) {
        alert('Failed to save settings');
    }
}
