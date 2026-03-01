// Games Page JavaScript

let allGames = [];
let gamesBySubject = {};

// Load games on page load
document.addEventListener('DOMContentLoaded', function() {
    loadGames();
});

// Load all games from Google Sheets
async function loadGames() {
    try {
        const data = await fetchData(API_ENDPOINTS.GET_GAMES || API_ENDPOINTS.GET_TOOLS + '&type=games');
        
        if (data && data.success && data.games) {
            allGames = data.games;
            organizeGamesBySubject();
            displaySubjects();
        } else {
            document.getElementById('subjectsGrid').innerHTML = `
                <div class="no-data-card">
                    <div class="no-data-icon">📭</div>
                    <h3>હાલમાં કોઈ ગેમ્સ ઉપલબ્ધ નથી</h3>
                    <p>ટૂંક સમયમાં નવી ગેમ્સ ઉમેરવામાં આવશે</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading games:', error);
        document.getElementById('subjectsGrid').innerHTML = `
            <div class="no-data-card">
                <div class="no-data-icon">⚠️</div>
                <h3>ગેમ્સ લોડ કરવામાં સમસ્યા</h3>
                <p>કૃપા કરીને પછીથી ફરી પ્રયાસ કરો</p>
            </div>
        `;
    }
}

// Organize games by subject
function organizeGamesBySubject() {
    gamesBySubject = {};
    
    allGames.forEach(game => {
        const subject = game.subject || 'અન્ય';
        if (!gamesBySubject[subject]) {
            gamesBySubject[subject] = [];
        }
        gamesBySubject[subject].push(game);
    });
}

// Display subject folders
function displaySubjects() {
    const subjectsGrid = document.getElementById('subjectsGrid');
    subjectsGrid.innerHTML = '';
    
    const subjects = Object.keys(gamesBySubject);
    
    if (subjects.length === 0) {
        subjectsGrid.innerHTML = `
            <div class="no-data-card">
                <div class="no-data-icon">📭</div>
                <h3>હાલમાં કોઈ વિષયો ઉપલબ્ધ નથી</h3>
            </div>
        `;
        return;
    }
    
    subjects.forEach((subject, index) => {
        const count = gamesBySubject[subject].length;
        const icon = getSubjectIcon(subject);
        
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.onclick = () => showGamesForSubject(subject);
        
        card.innerHTML = `
            <div class="subject-icon">${icon}</div>
            <h3 class="subject-name">${subject}</h3>
            <span class="subject-count">${count} ગેમ્સ</span>
        `;
        
        subjectsGrid.appendChild(card);
    });
}

// Get icon for subject
function getSubjectIcon(subject) {
    const icons = {
        'ગુજરાતી': '📖',
        'અંગ્રેજી': '🔤',
        'ગણિત': '🔢',
        'વિજ્ઞાન': '🔬',
        'સામાજિક વિજ્ઞાન': '🌍',
        'સંસ્કૃત': '📜',
        'હિન્દી': '🅷',
        'કમ્પ્યુટર': '💻',
        'પર્યાવરણ': '🌱',
        'અન્ય': '🎯'
    };
    
    return icons[subject] || '🎮';
}

// Show games for selected subject
function showGamesForSubject(subject) {
    const games = gamesBySubject[subject] || [];
    
    if (games.length === 0) {
        document.getElementById('noGamesMessage').style.display = 'block';
        document.getElementById('gamesSection').style.display = 'none';
        document.getElementById('subjectsGrid').style.display = 'none';
        return;
    }
    
    document.getElementById('selectedSubject').textContent = `${subject} - ગેમ્સ`;
    document.getElementById('subjectsGrid').style.display = 'none';
    document.getElementById('gamesSection').style.display = 'block';
    document.getElementById('noGamesMessage').style.display = 'none';
    
    displayGames(games);
}

// Display games
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';
    
    games.forEach((game, index) => {
        const card = createGameCard(game, index);
        gamesGrid.appendChild(card);
    });
}

// Create game card
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const icon = getSubjectIcon(game.subject);
    
    card.innerHTML = `
        <div class="game-thumbnail">
            <span style="font-size: 5rem;">${icon}</span>
            <span class="game-badge">NEW</span>
        </div>
        <div class="game-content">
            <h3 class="game-title">${game.title}</h3>
            <p class="game-subject">📚 ${game.subject}</p>
            <div class="game-actions">
                <button class="btn-play" onclick="playGame('${game.fileName}', '${game.title}')">
                    ▶️ રમો
                </button>
                <button class="btn-preview" onclick="previewGame('${game.fileName}', '${game.title}')">
                    👁️
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Show subjects view
function showSubjects() {
    document.getElementById('subjectsGrid').style.display = 'grid';
    document.getElementById('gamesSection').style.display = 'none';
    document.getElementById('noGamesMessage').style.display = 'none';
}

// Play game in full screen
function playGame(fileName, title) {
    if (!fileName) {
        alert('ગેમ ઉપલબ્ધ નથી');
        return;
    }
    
    const gamePath = `../games/${fileName}`;
    openGameModal(gamePath, title);
}

// Preview game
function previewGame(fileName, title) {
    playGame(fileName, title);
}

// Open game modal
function openGameModal(gamePath, title) {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
        <div class="game-modal-content">
            <div class="game-modal-header">
                <h3>🎮 ${title}</h3>
                <button class="game-modal-close" onclick="closeGameModal()">✖️ બંધ કરો</button>
            </div>
            <div class="game-modal-body">
                <iframe src="${gamePath}" allowfullscreen></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close game modal
function closeGameModal() {
    const modal = document.querySelector('.game-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGameModal();
    }
});
