// Online Education Guru - Google Apps Script
// Deploy this as a Web App in Google Apps Script

// ============================================
// CONFIGURATION - Update these values
// ============================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID

// Sheet Names
const SHEETS = {
  NEWS: 'News',
  ADMIN: 'Admin',
  TEACHERS: 'Teachers',
  STUDENTS: 'Students',
  QUIZ_QUESTIONS: 'QuizQuestions',
  QUIZ_RESULTS: 'QuizResults',
  LEADERBOARD: 'Leaderboard',
  TOOLS: 'Tools',
  MATERIALS: 'Materials',
  READING_WRITING: 'ReadingWriting',
  MATH: 'Math',
  GAMES: 'Games',
  SETTINGS: 'Settings'
};

// ============================================
// MAIN FUNCTION - Handle all requests
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'getNews':
        return getNews();
      case 'getLeaderboard':
        return getLeaderboard(e.parameter);
      case 'getTools':
        return getTools(e.parameter);
      case 'getMaterials':
        return getMaterials(e.parameter);
      case 'getQuiz':
        return getQuiz(e.parameter);
      case 'getUserScore':
        return getUserScore(e.parameter);
      case 'getSettings':
        return getSettings();
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch(error) {
    return createResponse(false, error.toString());
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'registerUser':
        return registerUser(data);
      case 'loginUser':
        return loginUser(data);
      case 'submitQuiz':
        return submitQuiz(data);
      case 'adminLogin':
        return adminLogin(data);
      case 'updateSettings':
        return updateSettings(data);
      case 'addTool':
        return addTool(data);
      case 'removeTool':
        return removeTool(data);
      case 'addMaterial':
        return addMaterial(data);
      case 'addNews':
        return addNews(data);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch(error) {
    return createResponse(false, error.toString());
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    Object.assign(response, data);
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  
  return sheet;
}

function initializeSheet(sheet, sheetName) {
  const headers = getHeadersForSheet(sheetName);
  if (headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

function getHeadersForSheet(sheetName) {
  const headerMap = {
    'News': ['ID', 'Title', 'Link', 'Date', 'Active'],
    'Admin': ['Username', 'Password', 'Email', 'Role'],
    'Teachers': ['ID', 'Name', 'School', 'DiasCode', 'Mobile', 'Email', 'Verified', 'Date'],
    'Students': ['ID', 'Name', 'School', 'Mobile', 'Standard', 'Date'],
    'QuizQuestions': ['ID', 'Category', 'Standard', 'Subject', 'Chapter', 'Question', 'Option1', 'Option2', 'Option3', 'Option4', 'Correct', 'Marks'],
    'QuizResults': ['ID', 'UserID', 'Name', 'Mobile', 'Category', 'Standard', 'Subject', 'Score', 'Total', 'Percentage', 'Date'],
    'Leaderboard': ['Rank', 'Name', 'Score', 'QuizType', 'Date'],
    'Tools': ['ID', 'Type', 'Name', 'FileName', 'UploadDate', 'Active'],
    'Materials': ['ID', 'Standard', 'Type', 'Subject', 'Title', 'Link', 'Date'],
    'ReadingWriting': ['ID', 'Title', 'Link', 'Description', 'Date'],
    'Math': ['ID', 'Title', 'Link', 'Description', 'Date'],
    'Games': ['ID', 'Subject', 'Title', 'FileName', 'Date'],
    'Settings': ['Key', 'Value', 'Updated']
  };
  
  return headerMap[sheetName] || [];
}

// ============================================
// NEWS FUNCTIONS
// ============================================

function getNews() {
  const sheet = getSheet(SHEETS.NEWS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createResponse(true, 'No news available', { news: [] });
  }
  
  const news = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === true || data[i][4] === 'TRUE') { // Active column
      news.push({
        id: data[i][0],
        title: data[i][1],
        link: data[i][2],
        date: data[i][3]
      });
    }
  }
  
  return createResponse(true, 'News loaded', { news: news });
}

function addNews(data) {
  const sheet = getSheet(SHEETS.NEWS);
  const id = generateID();
  const row = [
    id,
    data.title,
    data.link || '',
    new Date(),
    true
  ];
  
  sheet.appendRow(row);
  return createResponse(true, 'News added successfully');
}

// ============================================
// USER AUTHENTICATION
// ============================================

function registerUser(data) {
  const userType = data.userType; // 'teacher' or 'student'
  const sheet = getSheet(userType === 'teacher' ? SHEETS.TEACHERS : SHEETS.STUDENTS);
  
  // Check if mobile already exists
  const existingData = sheet.getDataRange().getValues();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][4] === data.mobile) { // Mobile column
      return createResponse(false, 'આ મોબાઈલ નંબર પહેલેથી રજિસ્ટર છે');
    }
  }
  
  const id = generateID();
  let row;
  
  if (userType === 'teacher') {
    row = [
      id,
      data.name,
      data.school,
      data.diasCode,
      data.mobile,
      data.email,
      false, // Not verified initially
      new Date()
    ];
  } else {
    row = [
      id,
      data.name,
      data.school,
      data.mobile,
      data.standard || '',
      new Date()
    ];
  }
  
  sheet.appendRow(row);
  
  // Send OTP if teacher
  if (userType === 'teacher') {
    sendOTP(data.email, data.mobile);
  }
  
  return createResponse(true, 'રજિસ્ટ્રેશન સફળ રહ્યું', { userId: id });
}

function loginUser(data) {
  const userType = data.userType;
  const sheet = getSheet(userType === 'teacher' ? SHEETS.TEACHERS : SHEETS.STUDENTS);
  const mobile = data.mobile;
  
  const existingData = sheet.getDataRange().getValues();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][4] === mobile) {
      // For teachers, check verification
      if (userType === 'teacher' && !existingData[i][6]) {
        return createResponse(false, 'તમારું એકાઉન્ટ વેરીફાય થયેલ નથી');
      }
      
      const user = {
        id: existingData[i][0],
        name: existingData[i][1],
        school: existingData[i][2],
        mobile: existingData[i][4],
        type: userType
      };
      
      return createResponse(true, 'લોગિન સફળ', { user: user });
    }
  }
  
  return createResponse(false, 'યુઝર મળ્યો નથી');
}

function sendOTP(email, mobile) {
  // Implement OTP sending logic here
  // You can use Gmail API or third-party SMS service
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Store OTP temporarily (you may want to create a separate sheet for this)
  const sheet = getSheet('OTP');
  sheet.appendRow([email, mobile, otp, new Date()]);
  
  // Send email
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Online Education Guru - OTP Verification',
      body: `તમારો OTP: ${otp}\n\nઆ OTP 10 મિનિટ માટે માન્ય છે.`
    });
  } catch(e) {
    Logger.log('Error sending OTP: ' + e);
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

function adminLogin(data) {
  const sheet = getSheet(SHEETS.ADMIN);
  const adminData = sheet.getDataRange().getValues();
  
  for (let i = 1; i < adminData.length; i++) {
    if (adminData[i][0] === data.username && adminData[i][1] === data.password) {
      return createResponse(true, 'Admin login successful', {
        admin: {
          username: adminData[i][0],
          role: adminData[i][3]
        }
      });
    }
  }
  
  return createResponse(false, 'Invalid credentials');
}

// ============================================
// QUIZ FUNCTIONS
// ============================================

function getQuiz(params) {
  const sheet = getSheet(SHEETS.QUIZ_QUESTIONS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createResponse(false, 'No questions available');
  }
  
  // Filter questions based on parameters
  const questions = [];
  for (let i = 1; i < data.length; i++) {
    const matches = 
      (!params.category || data[i][1] === params.category) &&
      (!params.standard || data[i][2] === params.standard) &&
      (!params.subject || data[i][3] === params.subject) &&
      (!params.chapter || data[i][4] === params.chapter);
    
    if (matches) {
      questions.push({
        id: data[i][0],
        question: data[i][5],
        options: [data[i][6], data[i][7], data[i][8], data[i][9]],
        correct: data[i][10],
        marks: data[i][11]
      });
    }
  }
  
  // Shuffle and limit questions
  const limit = parseInt(params.limit) || 10;
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);
  
  return createResponse(true, 'Questions loaded', { questions: selected });
}

function submitQuiz(data) {
  const sheet = getSheet(SHEETS.QUIZ_RESULTS);
  const id = generateID();
  
  const row = [
    id,
    data.userId || '',
    data.name,
    data.mobile,
    data.category,
    data.standard || '',
    data.subject || '',
    data.score,
    data.total,
    (data.score / data.total * 100).toFixed(2),
    new Date()
  ];
  
  sheet.appendRow(row);
  
  // Update leaderboard
  updateLeaderboard(data);
  
  return createResponse(true, 'Quiz submitted successfully', { resultId: id });
}

function updateLeaderboard(quizData) {
  const sheet = getSheet(SHEETS.LEADERBOARD);
  const data = sheet.getDataRange().getValues();
  
  // Add new entry
  sheet.appendRow([
    data.length, // Rank (will be recalculated)
    quizData.name,
    quizData.score,
    quizData.category,
    new Date()
  ]);
  
  // Sort by score
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5);
  range.sort([{column: 3, ascending: false}]);
  
  // Update ranks
  const sortedData = sheet.getDataRange().getValues();
  for (let i = 1; i < sortedData.length; i++) {
    sheet.getRange(i + 1, 1).setValue(i);
  }
}

function getLeaderboard(params) {
  const sheet = getSheet(SHEETS.LEADERBOARD);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createResponse(true, 'No data', { leaderboard: [] });
  }
  
  const leaderboard = [];
  const limit = parseInt(params.limit) || 50;
  
  for (let i = 1; i < Math.min(data.length, limit + 1); i++) {
    leaderboard.push({
      rank: data[i][0],
      name: data[i][1],
      score: data[i][2],
      quizType: data[i][3],
      date: data[i][4]
    });
  }
  
  return createResponse(true, 'Leaderboard loaded', { leaderboard: leaderboard });
}

function getUserScore(params) {
  const sheet = getSheet(SHEETS.QUIZ_RESULTS);
  const data = sheet.getDataRange().getValues();
  
  const userScores = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === params.mobile) {
      userScores.push({
        category: data[i][4],
        score: data[i][7],
        total: data[i][8],
        percentage: data[i][9],
        date: data[i][10]
      });
    }
  }
  
  return createResponse(true, 'Scores loaded', { scores: userScores });
}

// ============================================
// TOOLS FUNCTIONS
// ============================================

function getTools(params) {
  const sheet = getSheet(SHEETS.TOOLS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createResponse(true, 'No tools available', { tools: [] });
  }
  
  const tools = [];
  const toolType = params.type; // 'teacher' or 'office'
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === toolType && data[i][5] === true) {
      tools.push({
        id: data[i][0],
        name: data[i][2],
        fileName: data[i][3],
        date: data[i][4]
      });
    }
  }
  
  return createResponse(true, 'Tools loaded', { tools: tools });
}

function addTool(data) {
  const sheet = getSheet(SHEETS.TOOLS);
  const id = generateID();
  
  const row = [
    id,
    data.type, // 'teacher' or 'office'
    data.name,
    data.fileName,
    new Date(),
    true
  ];
  
  sheet.appendRow(row);
  return createResponse(true, 'Tool added successfully');
}

function removeTool(data) {
  const sheet = getSheet(SHEETS.TOOLS);
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.id) {
      sheet.getRange(i + 1, 6).setValue(false); // Mark as inactive
      return createResponse(true, 'Tool removed successfully');
    }
  }
  
  return createResponse(false, 'Tool not found');
}

// ============================================
// MATERIALS FUNCTIONS
// ============================================

function getMaterials(params) {
  const sheet = getSheet(SHEETS.MATERIALS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createResponse(true, 'No materials available', { materials: [] });
  }
  
  const materials = [];
  
  for (let i = 1; i < data.length; i++) {
    const matches = 
      (!params.standard || data[i][1] === params.standard) &&
      (!params.type || data[i][2] === params.type) &&
      (!params.subject || data[i][3] === params.subject);
    
    if (matches) {
      materials.push({
        id: data[i][0],
        standard: data[i][1],
        type: data[i][2],
        subject: data[i][3],
        title: data[i][4],
        link: data[i][5],
        date: data[i][6]
      });
    }
  }
  
  return createResponse(true, 'Materials loaded', { materials: materials });
}

function addMaterial(data) {
  const sheet = getSheet(SHEETS.MATERIALS);
  const id = generateID();
  
  const row = [
    id,
    data.standard,
    data.type,
    data.subject,
    data.title,
    data.link,
    new Date()
  ];
  
  sheet.appendRow(row);
  return createResponse(true, 'Material added successfully');
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================

function getSettings() {
  const sheet = getSheet(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();
  
  const settings = {};
  for (let i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  
  return createResponse(true, 'Settings loaded', { settings: settings });
}

function updateSettings(data) {
  const sheet = getSheet(SHEETS.SETTINGS);
  const existingData = sheet.getDataRange().getValues();
  
  // Update or add setting
  let found = false;
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][0] === data.key) {
      sheet.getRange(i + 1, 2).setValue(data.value);
      sheet.getRange(i + 1, 3).setValue(new Date());
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([data.key, data.value, new Date()]);
  }
  
  return createResponse(true, 'Settings updated');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateID() {
  return 'OEG' + new Date().getTime() + Math.floor(Math.random() * 1000);
}
