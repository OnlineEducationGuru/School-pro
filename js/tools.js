// Tools Page JavaScript

// Determine tool type from current page or window variable
const CURRENT_TOOL_TYPE = window.TOOL_TYPE || (window.location.pathname.includes('office') ? 'office' : 'teacher');

// Load tools on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTools();
});

// Load tools from Google Sheets
async function loadTools() {
    const gridContainer = document.getElementById('toolsGrid');
    const noToolsMessage = document.getElementById('noToolsMessage');
    
    try {
        const data = await fetchData(API_ENDPOINTS.GET_TOOLS, { type: CURRENT_TOOL_TYPE });
        
        if (data && data.success && data.tools && data.tools.length > 0) {
            displayTools(data.tools);
            noToolsMessage.style.display = 'none';
        } else {
            gridContainer.innerHTML = '';
            noToolsMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading tools:', error);
        gridContainer.innerHTML = `
            <div class="no-data-card">
                <div class="no-data-icon">⚠️</div>
                <h3>સાધનો લોડ કરવામાં સમસ્યા</h3>
                <p>કૃપા કરીને પછીથી ફરી પ્રયાસ કરો</p>
            </div>
        `;
    }
}

// Display tools in grid
function displayTools(tools) {
    const gridContainer = document.getElementById('toolsGrid');
    gridContainer.innerHTML = '';
    
    tools.forEach((tool, index) => {
        const toolCard = createToolCard(tool, index);
        gridContainer.appendChild(toolCard);
    });
}

// Create tool card element
function createToolCard(tool, index) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const formattedDate = formatDate(tool.date);
    
    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">🔧</div>
            <div class="tool-info">
                <h3 class="tool-title">${tool.name}</h3>
                <p class="tool-date">📅 ${formattedDate}</p>
            </div>
        </div>
        <div class="tool-actions">
            <button class="btn-tool btn-open" onclick="openTool('${tool.fileName}')">
                🚀 ખોલો
            </button>
            <button class="btn-tool btn-view" onclick="viewTool('${tool.fileName}')">
                👁️ જુઓ
            </button>
        </div>
    `;
    
    return card;
}

// Open tool in new page
function openTool(fileName) {
    if (!fileName) {
        alert('સાધન ઉપલબ્ધ નથી');
        return;
    }
    
    const toolPath = `../tools/${CURRENT_TOOL_TYPE}/${fileName}`;
    window.open(toolPath, '_blank');
}

// View tool in iframe or new tab
function viewTool(fileName) {
    if (!fileName) {
        alert('સાધન ઉપલબ્ધ નથી');
        return;
    }
    
    const toolPath = `../tools/${CURRENT_TOOL_TYPE}/${fileName}`;
    
    // Create modal to view tool
    const modal = document.createElement('div');
    modal.className = 'tool-modal';
    modal.innerHTML = `
        <div class="tool-modal-content">
            <div class="tool-modal-header">
                <h3>સાધન પૂર્વાવલોકન</h3>
                <button class="tool-modal-close" onclick="closeToolModal()">✖️</button>
            </div>
            <div class="tool-modal-body">
                <iframe src="${toolPath}" frameborder="0"></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close tool modal
function closeToolModal() {
    const modal = document.querySelector('.tool-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Format date in Gujarati
function formatDate(dateString) {
    if (!dateString) return 'તારીખ ઉપલબ્ધ નથી';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    try {
        return date.toLocaleDateString('gu-IN', options);
    } catch (e) {
        return date.toLocaleDateString('en-IN', options);
    }
}

// Add modal styles dynamically
const modalStyles = `
<style>
.tool-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

.tool-modal-content {
    background: white;
    border-radius: 15px;
    width: 100%;
    max-width: 1200px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
}

.tool-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 2px solid #e5e7eb;
}

.tool-modal-header h3 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.5rem;
}

.tool-modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px 10px;
    transition: transform 0.2s;
}

.tool-modal-close:hover {
    transform: scale(1.2);
}

.tool-modal-body {
    flex: 1;
    padding: 20px;
    overflow: hidden;
}

.tool-modal-body iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 10px;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .tool-modal-content {
        height: 95vh;
    }
    
    .tool-modal-header {
        padding: 15px 20px;
    }
    
    .tool-modal-header h3 {
        font-size: 1.2rem;
    }
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', modalStyles);
