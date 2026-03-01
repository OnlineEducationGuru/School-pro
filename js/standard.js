// Standard Page JavaScript

let currentStandard = '';
let currentMaterialType = '';
let allMaterials = [];

// Get standard from URL parameter
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentStandard = urlParams.get('std') || '1';
    
    updatePageTitle();
    loadMaterialsForStandard();
});

// Update page title based on standard
function updatePageTitle() {
    const titles = {
        'balvatika': 'બાલ વાટિકા',
        '1': 'ધોરણ 1',
        '2': 'ધોરણ 2',
        '3': 'ધોરણ 3',
        '4': 'ધોરણ 4',
        '5': 'ધોરણ 5',
        '6': 'ધોરણ 6',
        '7': 'ધોરણ 7',
        '8': 'ધોરણ 8',
        '9': 'ધોરણ 9',
        '10': 'ધોરણ 10',
        '11': 'ધોરણ 11',
        '12': 'ધોરણ 12'
    };
    
    const title = titles[currentStandard] || 'ધોરણ';
    document.getElementById('standardTitle').textContent = title;
    document.getElementById('standardSubtitle').textContent = `${title} - અભ્યાસ સામગ્રી`;
    document.title = `${title} - Online Education Guru`;
}

// Load all materials for the standard
async function loadMaterialsForStandard() {
    try {
        const data = await fetchData(API_ENDPOINTS.GET_MATERIALS, { 
            standard: currentStandard 
        });
        
        if (data && data.success && data.materials) {
            allMaterials = data.materials;
        } else {
            allMaterials = [];
        }
    } catch (error) {
        console.error('Error loading materials:', error);
        allMaterials = [];
    }
}

// Show materials by type
async function showMaterialsByType(type) {
    currentMaterialType = type;
    
    const typeNames = {
        'textbook': 'પાઠ્યપુસ્તક',
        'workbook': 'સ્વાધ્યાયપોથી',
        'testpaper': 'ટેસ્ટ પેપર',
        'solution': 'પેપર સોલ્યુશન',
        'notes': 'નોંધ',
        'other': 'અન્ય'
    };
    
    document.getElementById('materialTypeTitle').textContent = typeNames[type] || 'સામગ્રી';
    document.getElementById('materialsSection').style.display = 'block';
    document.querySelector('.material-types-grid').style.display = 'none';
    
    const listContainer = document.getElementById('materialsList');
    const noMaterialsMessage = document.getElementById('noMaterialsMessage');
    
    listContainer.innerHTML = `
        <div class="loading-container">
            <div class="loader"></div>
            <p>સામગ્રી લોડ થઈ રહી છે...</p>
        </div>
    `;
    
    try {
        const data = await fetchData(API_ENDPOINTS.GET_MATERIALS, { 
            standard: currentStandard,
            type: type 
        });
        
        if (data && data.success && data.materials && data.materials.length > 0) {
            displayMaterials(data.materials);
            noMaterialsMessage.style.display = 'none';
        } else {
            listContainer.innerHTML = '';
            noMaterialsMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading materials:', error);
        listContainer.innerHTML = `
            <div class="no-data-card">
                <div class="no-data-icon">⚠️</div>
                <h3>સામગ્રી લોડ કરવામાં સમસ્યા</h3>
                <p>કૃપા કરીને પછીથી ફરી પ્રયાસ કરો</p>
            </div>
        `;
    }
}

// Display materials
function displayMaterials(materials) {
    const listContainer = document.getElementById('materialsList');
    listContainer.innerHTML = '';
    
    materials.forEach((material, index) => {
        const item = createMaterialItem(material, index);
        listContainer.appendChild(item);
    });
}

// Create material item
function createMaterialItem(material, index) {
    const item = document.createElement('div');
    item.className = 'material-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    const formattedDate = formatDate(material.date);
    
    item.innerHTML = `
        <div class="material-header">
            <div class="material-info">
                <h3 class="material-title">${material.title}</h3>
                <span class="material-subject">${material.subject || 'સામાન્ય'}</span>
                <div class="material-meta">
                    <span class="meta-item">📅 ${formattedDate}</span>
                    ${material.size ? `<span class="meta-item">📦 ${material.size}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="material-actions">
            <button class="btn-material btn-download" onclick="downloadMaterial('${material.link}', '${material.title}')">
                ⬇️ ડાઉનલોડ
            </button>
            <button class="btn-material btn-view-material" onclick="viewMaterial('${material.link}')">
                👁️ જુઓ
            </button>
            <button class="btn-material btn-share" onclick="shareMaterial('${material.title}', '${material.link}')">
                🔗 શેર કરો
            </button>
        </div>
    `;
    
    return item;
}

// Show material types
function showMaterialTypes() {
    document.querySelector('.material-types-grid').style.display = 'grid';
    document.getElementById('materialsSection').style.display = 'none';
    document.getElementById('noMaterialsMessage').style.display = 'none';
}

// Download material
function downloadMaterial(link, title) {
    if (!link) {
        alert('લિંક ઉપલબ્ધ નથી');
        return;
    }
    
    let downloadLink = link;
    if (link.includes('drive.google.com')) {
        const fileId = extractGoogleDriveFileId(link);
        if (fileId) {
            downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
    }
    
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = title || 'download';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// View material
function viewMaterial(link) {
    if (!link) {
        alert('લિંક ઉપલબ્ધ નથી');
        return;
    }
    
    let viewLink = link;
    if (link.includes('drive.google.com')) {
        const fileId = extractGoogleDriveFileId(link);
        if (fileId) {
            viewLink = `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }
    
    window.open(viewLink, '_blank');
}

// Share material
function shareMaterial(title, link) {
    if (!link) {
        alert('લિંક ઉપલબ્ધ નથી');
        return;
    }
    
    const text = `${title}\n\nOnline Education Guru\n${link}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: link
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('લિંક કોપી થઈ ગઈ!');
        }).catch(() => {
            // WhatsApp share as fallback
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Extract Google Drive file ID
function extractGoogleDriveFileId(url) {
    const patterns = [
        /\/file\/d\/([^\/]+)/,
        /id=([^&]+)/,
        /\/d\/([^\/]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Format date
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
