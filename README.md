# Online Education Guru - ગુજરાત શિક્ષણ વેબ એપ્લિકેશન

સંપૂર્ણ ડિજિટલ શિક્ષણ પ્લેટફોર્મ ગુજરાત શિક્ષણ માટે

## 🌟 Features

### 1. મુખ્ય Features
- ✅ Breaking News Ticker (Google Sheets સાથે)
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Right-click Protection
- ✅ Google AdSense Integration
- ✅ Login/Registration System
- ✅ Admin Panel

### 2. Tools Section
- 👨‍🏫 **Teacher's Tools** - શિક્ષકો માટે HTML tools
- 💼 **Office Tools** - ઓફિસ કાર્યો માટે tools
- 📝 **વાંચન-લેખન** - વાંચન લેખન સામગ્રી
- 🔢 **ગણન** - ગણિત સામગ્રી

### 3. ધોરણ વાઈઝ સામગ્રી
- 📚 બાલ વાટિકા થી ધોરણ 12
- 📖 પાઠ્યપુસ્તક
- 📝 સ્વાધ્યાયપોથી
- 📄 ટેસ્ટ પેપર
- ✅ સોલ્યુશન્સ
- 📋 નોંધ

### 4. ઇન્ટરએક્ટિવ ગેમ્સ
- 🎮 વિષય આધારિત ગેમ્સ
- 🎯 HTML5 ગેમ્સ સપોર્ટ
- 📱 Fullscreen મોડ

### 5. Quiz System
- 🏆 ધોરણ વાઈઝ Quiz
- 📊 GK, NMMS, PSE, CET Quiz
- 📜 Certificate Generation (PDF/PNG)
- 📤 WhatsApp Sharing
- 🏅 Leaderboard
- 💯 Real-time Results

## 📁 Project Structure

```
online-education-guru/
├── index.html                 # હોમપેજ
├── ads.txt                    # AdSense
├── robots.txt                 # SEO
├── code.gs                    # Google Apps Script
│
├── css/
│   ├── style.css              # મુખ્ય CSS
│   ├── auth.css               # Login/Register
│   ├── pages.css              # Static pages
│   ├── tools.css              # Tools pages
│   ├── games.css              # Games page
│   ├── standard.css           # Standard page
│   ├── quiz.css               # Quiz system
│   └── admin.css              # Admin panel
│
├── js/
│   ├── config.js              # Configuration
│   ├── common.js              # Common functions
│   ├── main.js                # Homepage
│   ├── auth.js                # Authentication
│   ├── tools.js               # Tools functionality
│   ├── materials.js           # Materials
│   ├── games.js               # Games
│   ├── standard.js            # Standard pages
│   ├── quiz.js                # Quiz system
│   └── admin.js               # Admin panel
│
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── about.html
│   ├── contact.html
│   ├── privacy.html
│   ├── terms.html
│   ├── teachers-tools.html
│   ├── office-tools.html
│   ├── reading-writing.html
│   ├── math.html
│   ├── games.html
│   ├── standard.html
│   ├── quiz-standard.html
│   └── admin-panel.html
│
├── tools/
│   ├── teacher/               # Teacher tools (HTML files)
│   └── office/                # Office tools (HTML files)
│
├── games/                     # Games (HTML files)
│
└── images/
    ├── logo.png
    └── favicon.ico
```

## 🚀 Setup Instructions

### Step 1: Google Sheets Setup

1. **Create Google Sheet:**
   - Google Sheets માં નવી spreadsheet બનાવો
   - નીચેના sheets બનાવો:
     - News
     - Admin
     - Teachers
     - Students
     - QuizQuestions
     - QuizResults
     - Leaderboard
     - Tools
     - Materials
     - ReadingWriting
     - Math
     - Games
     - Settings

2. **Sheet Headers સેટ કરો:**
   
   **News Sheet:**
   ```
   ID | Title | Link | Date | Active
   ```
   
   **Admin Sheet:**
   ```
   Username | Password | Email | Role
   ```
   
   **Tools Sheet:**
   ```
   ID | Type | Name | FileName | UploadDate | Active
   ```
   
   **Materials Sheet:**
   ```
   ID | Standard | Type | Subject | Title | Link | Date
   ```
   
   **QuizQuestions Sheet:**
   ```
   ID | Category | Standard | Subject | Chapter | Question | Option1 | Option2 | Option3 | Option4 | Correct | Marks
   ```

### Step 2: Google Apps Script Setup

1. Google Sheets માં **Extensions > Apps Script** ખોલો
2. `code.gs` ફાઈલની સામગ્રી કોપી કરો
3. `SPREADSHEET_ID` અપડેટ કરો:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
4. **Deploy > New Deployment**:
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Deploy કરો
5. Web App URL કોપી કરો

### Step 3: Website Configuration

1. `js/config.js` માં Web App URL અપડેટ કરો:
   ```javascript
   SHEETS_API_URL: 'YOUR_WEB_APP_URL_HERE'
   ```

2. Google AdSense ID અપડેટ કરો:
   ```javascript
   ADSENSE_CLIENT: 'ca-pub-XXXXXXXXXX'
   ```

3. `ads.txt` માં તમારી Publisher ID અપડેટ કરો

### Step 4: Admin Setup

1. Google Sheet માં Admin sheet માં એડમિન યુઝર ઉમેરો:
   ```
   admin | your_password | admin@example.com | admin
   ```

2. Admin Panel Access:
   ```
   pages/admin-panel.html
   ```

### Step 5: Netlify Deployment

1. **GitHub Repository બનાવો:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Netlify પર Deploy:**
   - Netlify.com પર login કરો
   - "New site from Git" પસંદ કરો
   - તમારી repository સિલેક્ટ કરો
   - Deploy settings:
     - Build command: (empty)
     - Publish directory: /
   - "Deploy site" ક્લિક કરો

3. **Custom Domain (Optional):**
   - Netlify Dashboard > Domain Settings
   - Custom domain ઉમેરો

## 📱 Usage Guide

### For Students:

1. **Registration:**
   - નામ, શાળા, મોબાઈલ નંબર આપો
   - લોગિન કરો

2. **Quiz આપવા:**
   - Quiz section પસંદ કરો
   - ધોરણ, વિષય, પ્રકરણ પસંદ કરો
   - Quiz શરૂ કરો
   - Certificate ડાઉનલોડ કરો

3. **Materials Access:**
   - ધોરણ પસંદ કરો
   - Material type પસંદ કરો
   - Download/View કરો

### For Teachers:

1. **Registration:**
   - નામ, શાળા, DISE કોડ, મોબાઈલ, ઈમેલ
   - OTP verification
   - લોગિન કરો

2. **Tools Access:**
   - Teacher's Tools/Office Tools
   - Tools વાપરો

### For Admin:

1. **Login:**
   - `pages/admin-panel.html`
   - Username/Password

2. **Content Management:**
   - Breaking News ઉમેરો/કાઢો
   - Tools upload કરો
   - Materials ઉમેરો
   - Games upload કરો
   - Settings અપડેટ કરો

## 🔧 Features Details

### Breaking News
- Google Sheets માંથી automatic load
- Scrolling animation
- Clickable links

### Quiz System
- Multiple choice questions
- Timer
- Progress tracking
- Certificate generation
- WhatsApp sharing
- Leaderboard

### Materials System
- Google Drive integration
- Download/View options
- Share functionality
- Organized by standard/subject

### Admin Panel
- Secure login
- Content management
- File uploads
- Settings control

## 🎨 Customization

### Colors:
`css/style.css` માં CSS variables અપડેટ કરો:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --accent-color: #f59e0b;
}
```

### Logo/Favicon:
Admin Panel > Settings માંથી અપડેટ કરો

## 📝 Important Notes

1. **Google Sheets API:**
   - Web App URL યોગ્ય રીતે configure કરો
   - Permissions યોગ્ય સેટ કરો

2. **File Uploads:**
   - HTML files માન્ય યોગ્ય ફોલ્ડરમાં મૂકવી જોઈએ
   - Tools: `/tools/teacher/` અથવા `/tools/office/`
   - Games: `/games/`

3. **Google Drive Links:**
   - Sharing: "Anyone with the link"
   - Link format સાચું હોવું જોઈએ

4. **AdSense:**
   - ads.txt અપલોડ કરો
   - સાઈટ verify કરાવો

## 🐛 Troubleshooting

### Quiz પ્રશ્નો લોડ નથી થતા:
- Google Sheet માં QuizQuestions sheet તપાસો
- Web App URL સાચું છે?
- Permissions યોગ્ય છે?

### Tools દેખાતા નથી:
- HTML files યોગ્ય ફોલ્ડરમાં છે?
- Google Sheet માં Tools sheet અપડેટ કર્યું?

### Certificate જનરેટ થતું નથી:
- Canvas support છે?
- Browser updated છે?

## 📞 Support

Questions અથવા issues માટે:
- Email: info@onlineeducationguru.com
- GitHub Issues: Create an issue

## 📄 License

This project is created for educational purposes.

---

**Developed with ❤️ for Gujarat Education**

*Online Education Guru - ગુજરાત શિક્ષણ માટે સંપૂર્ણ ડિજિટલ સમાધાન*
