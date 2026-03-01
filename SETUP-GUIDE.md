# 📖 સેટઅપ ગાઈડ - Online Education Guru

આ વેબ એપ્લિકેશન સેટઅપ કરવા માટે સ્ટેપ બાય સ્ટેપ ગાઈડ

## 🎯 Step 1: Google Sheets બનાવો

### 1.1 નવી Spreadsheet બનાવો
1. [Google Sheets](https://sheets.google.com) પર જાઓ
2. "Blank" સ્પ્રેડશીટ બનાવો
3. નામ આપો: "Online Education Guru Database"

### 1.2 Required Sheets બનાવો

નીચેના બધા sheets બનાવો અને headers મૂકો:

#### **News Sheet**
| ID | Title | Link | Date | Active |
|----|-------|------|------|--------|
| 1 | સ્વાગત છે | | 2024-03-01 | TRUE |

#### **Admin Sheet**
| Username | Password | Email | Role |
|----------|----------|-------|------|
| admin | admin123 | admin@oeg.com | admin |

#### **Teachers Sheet**
| ID | Name | School | DiasCode | Mobile | Email | Verified | Date |
|----|------|--------|----------|--------|-------|----------|------|

#### **Students Sheet**
| ID | Name | School | Mobile | Standard | Date |
|----|------|--------|--------|----------|------|

#### **QuizQuestions Sheet**
| ID | Category | Standard | Subject | Chapter | Question | Option1 | Option2 | Option3 | Option4 | Correct | Marks |
|----|----------|----------|---------|---------|----------|---------|---------|---------|---------|---------|-------|

**Sample Data:**
```
1 | standard | 5 | ગણિત | પ્રકરણ 1 | 2+2 કેટલા? | 3 | 4 | 5 | 6 | 1 | 1
```

#### **QuizResults Sheet**
| ID | UserID | Name | Mobile | Category | Standard | Subject | Score | Total | Percentage | Date |
|----|--------|------|--------|----------|----------|---------|-------|-------|------------|------|

#### **Leaderboard Sheet**
| Rank | Name | Score | QuizType | Date |
|------|------|-------|----------|------|

#### **Tools Sheet**
| ID | Type | Name | FileName | UploadDate | Active |
|----|------|------|----------|------------|--------|

**Sample Data:**
```
1 | teacher | સમય કોષ્ટક | timetable.html | 2024-03-01 | TRUE
```

#### **Materials Sheet**
| ID | Standard | Type | Subject | Title | Link | Date |
|----|----------|------|---------|-------|------|------|

**Sample Data:**
```
1 | 5 | textbook | ગુજરાતી | ગુજરાતી પાઠ્યપુસ્તક | https://drive.google.com/file/d/xxx | 2024-03-01
```

#### **ReadingWriting Sheet**
| ID | Title | Link | Description | Date |
|----|-------|------|-------------|------|

#### **Math Sheet**
| ID | Title | Link | Description | Date |
|----|-------|------|-------------|------|

#### **Games Sheet**
| ID | Subject | Title | FileName | Date |
|----|---------|-------|----------|------|

**Sample Data:**
```
1 | ગણિત | ગણિત ગેમ | math-game.html | 2024-03-01
```

#### **Settings Sheet**
| Key | Value | Updated |
|-----|-------|---------|
| logo | images/logo.png | 2024-03-01 |
| favicon | favicon.ico | 2024-03-01 |
| siteTitle | Online Education Guru | 2024-03-01 |

### 1.3 Spreadsheet ID મેળવો
1. URL માંથી Spreadsheet ID કોપી કરો
2. URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

---

## 🔧 Step 2: Google Apps Script Setup

### 2.1 Apps Script ખોલો
1. Spreadsheet માં **Extensions > Apps Script**
2. નવી પ્રોજેક્ટ ખુલશે

### 2.2 Code અપડેટ કરો
1. `code.gs` ફાઈલની સંપૂર્ણ સામગ્રી કોપી કરો
2. Apps Script Editor માં paste કરો
3. `SPREADSHEET_ID` અપડેટ કરો:
```javascript
const SPREADSHEET_ID = 'તમારી_SPREADSHEET_ID_અહીં';
```

### 2.3 Deploy કરો
1. ઉપર જમણી બાજુએ **Deploy > New deployment** ક્લિક કરો
2. Settings:
   - **Type:** Web app
   - **Description:** OEG API v1
   - **Execute as:** Me (તમારું નામ)
   - **Who has access:** Anyone
3. **Deploy** ક્લિક કરો
4. Permissions આપો (Allow)
5. **Web app URL** કોપી કરો
   - Example: `https://script.google.com/macros/s/ABC123.../exec`

---

## 💻 Step 3: Website Files Setup

### 3.1 Config File અપડેટ કરો

`js/config.js` ફાઈલ ખોલો અને અપડેટ કરો:

```javascript
const CONFIG = {
    // તમારી Web App URL અહીં મૂકો
    SHEETS_API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    
    SITE_NAME: 'Online Education Guru',
    SITE_LOGO: 'images/logo.png',
    FAVICON: 'favicon.ico',
    
    // Google AdSense Client ID
    ADSENSE_CLIENT: 'ca-pub-XXXXXXXXXX',
};
```

### 3.2 AdSense Setup

1. **ads.txt** ફાઈલ અપડેટ કરો:
```
google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

2. તમારી AdSense Publisher ID મેળવો:
   - [Google AdSense](https://www.google.com/adsense) પર જાઓ
   - Account > Settings માંથી Publisher ID કોપી કરો

### 3.3 Logo & Favicon

1. **Logo બનાવો:**
   - Size: 200x200 પિક્સેલ
   - Format: PNG
   - Save as: `images/logo.png`

2. **Favicon બનાવો:**
   - Size: 32x32 અથવા 64x64
   - Format: ICO અથવા PNG
   - Save as: `favicon.ico`
   - Tool: [Favicon.io](https://favicon.io)

---

## 📁 Step 4: Folder Structure બનાવો

### 4.1 Required Folders

```
online-education-guru/
├── tools/
│   ├── teacher/        ← Teacher tools HTML files અહીં
│   └── office/         ← Office tools HTML files અહીં
│
├── games/              ← Games HTML files અહીં
│
└── images/
    ├── logo.png
    └── (other images)
```

### 4.2 Sample HTML Files

**Teacher Tool Example** (`tools/teacher/sample-tool.html`):
```html
<!DOCTYPE html>
<html>
<head>
    <title>Sample Tool</title>
</head>
<body>
    <h1>Teacher Tool</h1>
    <!-- Your tool content -->
</body>
</html>
```

---

## 🌐 Step 5: Netlify Deployment

### 5.1 GitHub Repository

1. **GitHub Account બનાવો** (જો નથી)
2. **નવી Repository બનાવો:**
   - Repository name: `online-education-guru`
   - Public/Private: Public
   - Initialize: Without README

3. **Local Git Setup:**
```bash
cd online-education-guru
git init
git add .
git commit -m "Initial commit - OEG Website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/online-education-guru.git
git push -u origin main
```

### 5.2 Netlify Deployment

1. [Netlify.com](https://netlify.com) પર જાઓ
2. Sign up with GitHub
3. **New site from Git** ક્લિક કરો
4. **GitHub** પસંદ કરો
5. તમારી repository પસંદ કરો: `online-education-guru`
6. Deploy settings:
   - **Branch to deploy:** main
   - **Build command:** (leave empty)
   - **Publish directory:** /
7. **Deploy site** ક્લિક કરો

### 5.3 Custom Domain (Optional)

1. Netlify Dashboard માં જાઓ
2. **Domain settings** ક્લિક કરો
3. **Add custom domain**
4. તમારું domain નામ દાખલ કરો
5. DNS settings અપડેટ કરો

---

## 🎮 Step 6: Content Upload

### 6.1 Admin Panel Access

1. તમારી સાઈટ પર જાઓ: `https://your-site.netlify.app/pages/admin-panel.html`
2. Login કરો:
   - Username: `admin`
   - Password: `admin123` (તમે Sheet માં મૂક્યો હોય તે)

### 6.2 Breaking News ઉમેરો

1. Admin Panel > **Breaking News** tab
2. News title અને link દાખલ કરો
3. **Add News** ક્લિક કરો

### 6.3 Tools Upload

1. **Tools Upload** tab માં જાઓ
2. Tool type પસંદ કરો (Teacher/Office)
3. Tool name દાખલ કરો
4. HTML file select કરો
5. **Upload Tool** ક્લિક કરો
6. Manually file `tools/teacher/` અથવા `tools/office/` માં મૂકો

### 6.4 Materials ઉમેરો

1. **Materials** tab માં જાઓ
2. Standard, Type, Subject પસંદ કરો
3. Title અને Google Drive link દાખલ કરો
4. **Add Material** ક્લિક કરો

### 6.5 Games Upload

1. **Games Upload** tab
2. Subject અને title દાખલ કરો
3. HTML file select કરો
4. Upload કરો
5. File `games/` ફોલ્ડરમાં મૂકો

---

## 📊 Step 7: Quiz Questions ઉમેરો

### 7.1 Google Sheet માં Questions

**QuizQuestions** sheet ખોલો અને add કરો:

| ID | Category | Standard | Subject | Chapter | Question | Option1 | Option2 | Option3 | Option4 | Correct | Marks |
|----|----------|----------|---------|---------|----------|---------|---------|---------|---------|---------|-------|
| 1 | standard | 5 | ગણિત | સંખ્યાઓ | 5+5=? | 8 | 10 | 12 | 15 | 1 | 1 |
| 2 | standard | 5 | ગણિત | સંખ્યાઓ | 10-3=? | 5 | 6 | 7 | 8 | 2 | 1 |

**Correct** column:
- 0 = Option1
- 1 = Option2
- 2 = Option3
- 3 = Option4

### 7.2 Test Quiz

1. વેબસાઈટ પર **Quiz** section
2. ધોરણ 5, ગણિત પસંદ કરો
3. Quiz શરૂ કરો
4. Certificate test કરો

---

## ✅ Step 8: Testing

### 8.1 Functionality Test

- [ ] Breaking news scroll થાય છે?
- [ ] Login/Registration કામ કરે છે?
- [ ] Tools open થાય છે?
- [ ] Materials download થાય છે?
- [ ] Games રમી શકાય છે?
- [ ] Quiz આપી શકાય છે?
- [ ] Certificate generate થાય છે?
- [ ] Admin panel કામ કરે છે?

### 8.2 Mobile Testing

- Responsive છે?
- Touch friendly છે?
- Animations સારા છે?

### 8.3 Browser Testing

- Chrome
- Firefox
- Safari
- Edge

---

## 🔒 Step 9: Security

### 9.1 Admin Password બદલો

Google Sheet > Admin Sheet માં password બદલો

### 9.2 HTTPS Enable

Netlify automatically HTTPS આપે છે. Domain settings માં verify કરો.

---

## 🎉 Congratulations!

તમારી વેબસાઈટ તૈયાર છે! 

### Next Steps:

1. Content ઉમેરવાનું ચાલુ રાખો
2. Users ને invite કરો
3. Feedback લો અને improve કરો

### Support:

- Questions? Email: info@onlineeducationguru.com
- Issues? GitHub Issues create કરો

---

**શુભેચ્છા! 🎊**

*Online Education Guru Team*
