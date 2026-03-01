// Online Education Guru - Main JavaScript

// Load Breaking News
async function loadNews() {
    try {
        const data = await fetchData(API_ENDPOINTS.GET_NEWS);
        if (data && data.success && data.news) {
            displayNews(data.news);
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Display news in ticker
function displayNews(newsItems) {
    const newsContent = document.getElementById('newsContent');
    if (!newsContent) return;
    
    newsContent.innerHTML = '';
    newsItems.forEach(item => {
        const span = document.createElement('span');
        span.className = 'news-item';
        span.textContent = item.title;
        span.onclick = () => {
            if (item.link) {
                window.open(item.link, '_blank');
            }
        };
        newsContent.appendChild(span);
    });
}

// Load Leaderboard
async function loadLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;
    
    try {
        const data = await fetchData(API_ENDPOINTS.GET_LEADERBOARD);
        if (data && data.success && data.leaderboard) {
            displayLeaderboard(data.leaderboard);
        } else {
            container.innerHTML = '<p class="text-center">હાલમાં કોઈ ડેટા ઉપલબ્ધ નથી</p>';
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        container.innerHTML = '<p class="text-center">ડેટા લોડ કરવામાં સમસ્યા</p>';
    }
}

// Display leaderboard
function displayLeaderboard(leaders) {
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;
    
    let html = `
        <div class="leaderboard-tabs">
            <button class="tab-btn active" onclick="showLeaderboardCategory('all')">બધા</button>
            <button class="tab-btn" onclick="showLeaderboardCategory('standard')">ધોરણ વાઈઝ</button>
            <button class="tab-btn" onclick="showLeaderboardCategory('gk')">GK</button>
            <button class="tab-btn" onclick="showLeaderboardCategory('competitive')">સ્પર્ધાત્મક</button>
        </div>
        <div class="leaderboard-list">
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>રેંક</th>
                        <th>નામ</th>
                        <th>સ્કોર</th>
                        <th>Quiz</th>
                    </tr>
                </thead>
                <tbody id="leaderboardBody">
    `;
    
    leaders.forEach((leader, index) => {
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        html += `
            <tr class="${rankClass}">
                <td>${medal} ${index + 1}</td>
                <td>${leader.name}</td>
                <td>${leader.score}</td>
                <td>${leader.quizType}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// Show leaderboard by category
function showLeaderboardCategory(category) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter and display leaderboard
    // This will be implemented with actual data filtering
}

// Load header and footer dynamically
async function loadHeaderFooter() {
    try {
        const data = await fetchData(API_ENDPOINTS.GET_SETTINGS);
        if (data && data.success) {
            updateHeaderFooter(data.settings);
        }
    } catch (error) {
        console.error('Error loading header/footer:', error);
    }
}

// Update header and footer with custom content
function updateHeaderFooter(settings) {
    // Update logo
    if (settings.logo) {
        const logoImg = document.getElementById('siteLogo');
        if (logoImg) logoImg.src = settings.logo;
    }
    
    // Update favicon
    if (settings.favicon) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = settings.favicon;
    }
    
    // Update site title
    if (settings.siteTitle) {
        const siteTitle = document.querySelector('.site-title');
        if (siteTitle) siteTitle.textContent = settings.siteTitle;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content
    if (CONFIG.FEATURES.NEWS_TICKER) {
        loadNews();
    }
    
    if (CONFIG.FEATURES.LEADERBOARD) {
        loadLeaderboard();
    }
    
    // Check login status
    const user = getUser();
    if (user) {
        updateNavForLoggedInUser(user);
    }
    
    // Add animation on scroll
    observeElements();
});

// Update navigation for logged-in user
function updateNavForLoggedInUser(user) {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Find login/register links and replace with user info
    const loginLink = navMenu.querySelector('a[href*="login"]');
    const registerLink = navMenu.querySelector('a[href*="register"]');
    
    if (loginLink && loginLink.parentElement) {
        loginLink.parentElement.innerHTML = `
            <a href="pages/profile.html" class="nav-link">
                👤 ${user.name}
            </a>
        `;
    }
    
    if (registerLink && registerLink.parentElement) {
        registerLink.parentElement.innerHTML = `
            <a href="#" class="nav-link" onclick="logoutUser(); return false;">
                🚪 લોગઆઉટ
            </a>
        `;
    }
}

// Intersection Observer for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.animate-slide-up').forEach(el => {
        observer.observe(el);
    });
}

// Google AdSense auto ads
(function() {
    if (CONFIG.ADSENSE_CLIENT) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    }
})();
