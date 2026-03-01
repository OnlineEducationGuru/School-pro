// Materials Page JavaScript

// Get material type from window variable
const CURRENT_MATERIAL_TYPE = window.MATERIAL_TYPE || 'reading-writing';

// Load materials on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMaterials();
});

// Load materials from Google Sheets
async function loadMaterials() {
    const listContainer = document.getElementById('materialsList');
    const noMaterialsMessage = document.getElementById('noMaterialsMessage');
    
    try {
        // Fetch materials based on type
        const sheetName = CURRENT_MATERIAL_TYPE === 'reading-writing' ? 'ReadingWriting' : 'Math';
        const endpoint = API_ENDPOINTS.GET_MATERIALS + `&sheet=${sheetName}`;
        
        const data = await fetchData(endpoint);
        
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

// Display materials in list
function displayMaterials(materials) {
    const listContainer = document.getElementById('materialsList');
    listContainer.innerHTML = '';
    
    materials.forEach((material, index) => {
        const materialItem = createMaterialItem(material, index);
        listContainer.appendChild(materialItem);
    });
}

// Create material item element
function createMaterialItem(material, index) {
    const item = document.createElement('div');
    item.className = 'material-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    const formattedDate = formatDate(material.date);
    
    item.innerHTML = `
        <div class="material-header">
            <h3 class="material-title">${material.title}</h3>
            <div class="material-meta">
                <span class="material-date">📅 ${formattedDate}</span>
            </div>
        </div>
        ${material.description ? `<p class="material-description">${material.description}</p>` : ''}
        <div class="material-actions">
            <button class="btn-material btn-download" onclick="downloadMaterial('${material.link}', '${material.title}')">
                ⬇️ ડાઉનલોડ
            </button>
            <button class="btn-material btn-view-material" onclick="viewMaterial('${material.link}')">
                👁️ જુઓ
            </button>
        </div>
    `;
    
    return item;
}

// Download material
function downloadMaterial(link, title) {
    if (!link) {
        alert('લિંક ઉપલબ્ધ નથી');
        return;
    }
    
    // If it's a Google Drive link, convert to download link
    let downloadLink = link;
    if (link.includes('drive.google.com')) {
        const fileId = extractGoogleDriveFileId(link);
        if (fileId) {
            downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
    }
    
    // Create temporary link and click it
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
    
    // If it's a Google Drive link, convert to view link
    let viewLink = link;
    if (link.includes('drive.google.com')) {
        const fileId = extractGoogleDriveFileId(link);
        if (fileId) {
            viewLink = `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }
    
    // Open in new tab
    window.open(viewLink, '_blank');
}

// Extract Google Drive file ID from various URL formats
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
