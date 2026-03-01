// Quiz JavaScript

let quizData = {
    standard: '',
    subject: '',
    chapter: '',
    questionCount: 20,
    category: 'standard'
};

let studentInfo = {
    name: '',
    mobile: ''
};

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;
let timerInterval = null;

// Subject list based on standard
const subjectsByStandard = {
    '1': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'પર્યાવરણ'],
    '2': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'પર્યાવરણ'],
    '3': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'પર્યાવરણ'],
    '4': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'પર્યાવરણ'],
    '5': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'પર્યાવરણ'],
    '6': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 'સંસ્કૃત'],
    '7': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 'સંસ્કૃત'],
    '8': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 'સંસ્કૃત'],
    '9': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 'સંસ્કૃત'],
    '10': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'વિજ્ઞાન', 'સામાજિક વિજ્ઞાન', 'સંસ્કૃત'],
    '11': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'ભૌતિકશાસ્ત્ર', 'રસાયણશાસ્ત્ર', 'જીવવિજ્ઞાન'],
    '12': ['ગુજરાતી', 'અંગ્રેજી', 'ગણિત', 'ભૌતિકશાસ્ત્ર', 'રસાયણશાસ્ત્ર', 'જીવવિજ્ઞાન']
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Standard selection change
    const standardSelect = document.getElementById('standard');
    if (standardSelect) {
        standardSelect.addEventListener('change', function() {
            updateSubjectDropdown(this.value);
        });
    }

    // Quiz selection form
    const quizSelectionForm = document.getElementById('quizSelectionForm');
    if (quizSelectionForm) {
        quizSelectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleQuizSelection();
        });
    }

    // Student info form
    const studentInfoForm = document.getElementById('studentInfoForm');
    if (studentInfoForm) {
        studentInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleStudentInfo();
        });
    }

    // Mobile number validation
    const mobileInput = document.getElementById('studentMobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
}

// Update subject dropdown
function updateSubjectDropdown(standard) {
    const subjectSelect = document.getElementById('subject');
    subjectSelect.innerHTML = '<option value="">વિષય પસંદ કરો</option>';
    
    if (standard && subjectsByStandard[standard]) {
        subjectsByStandard[standard].forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }
}

// Handle quiz selection
function handleQuizSelection() {
    quizData.standard = document.getElementById('standard').value;
    quizData.subject = document.getElementById('subject').value;
    quizData.chapter = document.getElementById('chapter').value;
    quizData.questionCount = parseInt(document.getElementById('questionCount').value);
    
    // Show student info section
    document.getElementById('quizSelectionSection').style.display = 'none';
    document.getElementById('studentInfoSection').style.display = 'block';
}

// Show quiz selection
function showQuizSelection() {
    document.getElementById('studentInfoSection').style.display = 'none';
    document.getElementById('quizSelectionSection').style.display = 'block';
}

// Handle student info
async function handleStudentInfo() {
    studentInfo.name = document.getElementById('studentName').value.trim();
    studentInfo.mobile = document.getElementById('studentMobile').value.trim();
    
    // Validate mobile
    if (!validateMobile(studentInfo.mobile)) {
        document.getElementById('mobileError').textContent = 'કૃપા કરીને માન્ય 10 અંકનો મોબાઈલ નંબર દાખલ કરો';
        return;
    }
    
    // Load quiz questions
    await loadQuestions();
}

// Load questions from Google Sheets
async function loadQuestions() {
    try {
        const params = {
            category: quizData.category,
            standard: quizData.standard,
            subject: quizData.subject,
            chapter: quizData.chapter,
            limit: quizData.questionCount
        };
        
        const data = await fetchData(API_ENDPOINTS.GET_QUIZ, params);
        
        if (data && data.success && data.questions && data.questions.length > 0) {
            questions = data.questions;
            userAnswers = new Array(questions.length).fill(null);
            startQuiz();
        } else {
            alert('આ વિષય માટે પ્રશ્નો ઉપલબ્ધ નથી. કૃપા કરીને અન્ય વિષય પસંદ કરો.');
            showQuizSelection();
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('પ્રશ્નો લોડ કરવામાં સમસ્યા. કૃપા કરીને ફરી પ્રયાસ કરો.');
        showQuizSelection();
    }
}

// Start quiz
function startQuiz() {
    document.getElementById('studentInfoSection').style.display = 'none';
    document.getElementById('quizInterface').style.display = 'block';
    
    // Set quiz title
    document.getElementById('quizTitle').textContent = `${quizData.subject} Quiz`;
    document.getElementById('quizMeta').textContent = `ધોરણ ${quizData.standard} | ${questions.length} પ્રશ્નો`;
    
    // Start timer
    quizStartTime = Date.now();
    startTimer();
    
    // Show first question
    currentQuestionIndex = 0;
    showQuestion();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - quizStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('timerDisplay').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Show question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) return;
    
    const question = questions[currentQuestionIndex];
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
        `પ્રશ્ન ${currentQuestionIndex + 1} / ${questions.length}`;
    
    // Update question
    document.getElementById('questionNumber').textContent = `પ્રશ્ન ${currentQuestionIndex + 1}`;
    document.getElementById('questionText').textContent = question.question;
    
    // Update options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        if (userAnswers[currentQuestionIndex] === index) {
            optionDiv.classList.add('selected');
        }
        optionDiv.onclick = () => selectOption(index);
        
        optionDiv.innerHTML = `
            <div class="option-radio"></div>
            <div class="option-text">${option}</div>
        `;
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    document.getElementById('btnPrev').disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('btnNext').style.display = 'none';
        document.getElementById('btnSubmit').style.display = 'inline-block';
    } else {
        document.getElementById('btnNext').style.display = 'inline-block';
        document.getElementById('btnSubmit').style.display = 'none';
    }
}

// Select option
function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    showQuestion();
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// Submit quiz
async function submitQuiz() {
    if (!confirm('શું તમે Quiz submit કરવા માંગો છો?')) {
        return;
    }
    
    // Stop timer
    clearInterval(timerInterval);
    const totalTime = Date.now() - quizStartTime;
    
    // Calculate results
    const results = calculateResults();
    
    // Save results to Google Sheets
    await saveResults(results, totalTime);
    
    // Show results
    showResults(results, totalTime);
}

// Calculate results
function calculateResults() {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    
    questions.forEach((question, index) => {
        if (userAnswers[index] === null) {
            unanswered++;
        } else if (userAnswers[index] === question.correct) {
            correct++;
        } else {
            wrong++;
        }
    });
    
    const total = questions.length;
    const score = correct;
    const percentage = ((correct / total) * 100).toFixed(2);
    
    return { correct, wrong, unanswered, total, score, percentage };
}

// Save results
async function saveResults(results, totalTime) {
    try {
        const data = {
            action: 'submitQuiz',
            userId: getUser()?.id || '',
            name: studentInfo.name,
            mobile: studentInfo.mobile,
            category: quizData.category,
            standard: quizData.standard,
            subject: quizData.subject,
            score: results.score,
            total: results.total,
            percentage: results.percentage,
            time: totalTime
        };
        
        await postData(API_ENDPOINTS.SUBMIT_QUIZ, data);
    } catch (error) {
        console.error('Error saving results:', error);
    }
}

// Show results
function showResults(results, totalTime) {
    document.getElementById('quizInterface').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    
    // Update result icon and title
    if (results.percentage >= 80) {
        document.getElementById('resultIcon').textContent = '🏆';
        document.getElementById('resultTitle').textContent = 'શાનદાર!';
    } else if (results.percentage >= 60) {
        document.getElementById('resultIcon').textContent = '🎉';
        document.getElementById('resultTitle').textContent = 'સરસ!';
    } else if (results.percentage >= 40) {
        document.getElementById('resultIcon').textContent = '👍';
        document.getElementById('resultTitle').textContent = 'સારો પ્રયાસ!';
    } else {
        document.getElementById('resultIcon').textContent = '💪';
        document.getElementById('resultTitle').textContent = 'ફરી પ્રયાસ કરો!';
    }
    
    // Update stats
    document.getElementById('scoreValue').textContent = `${results.score}/${results.total}`;
    document.getElementById('percentageValue').textContent = `${results.percentage}%`;
    
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    document.getElementById('timeValue').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update breakdown
    document.getElementById('correctCount').textContent = results.correct;
    document.getElementById('wrongCount').textContent = results.wrong;
    document.getElementById('unansweredCount').textContent = results.unanswered;
    
    // Generate certificate
    generateCertificate(results);
}

// Generate certificate
function generateCertificate(results) {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#7c3aed');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', canvas.width / 2, 120);
    
    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillText('This is to certify that', canvas.width / 2, 170);
    
    // Student name
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(studentInfo.name, canvas.width / 2, 230);
    
    // Description
    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Arial';
    ctx.fillText('has successfully completed the', canvas.width / 2, 280);
    
    // Quiz details
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`${quizData.subject} Quiz - ધોરણ ${quizData.standard}`, canvas.width / 2, 330);
    
    // Score
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`Score: ${results.score}/${results.total} (${results.percentage}%)`, canvas.width / 2, 390);
    
    // Date
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    const today = new Date().toLocaleDateString('gu-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    ctx.fillText(`તારીખ: ${today}`, canvas.width / 2, 450);
    
    // Signature
    ctx.font = 'italic 24px Arial';
    ctx.fillText('Online Education Guru', canvas.width / 2, 520);
    
    // Footer
    ctx.font = '18px Arial';
    ctx.fillText('ગુજરાત શિક્ષણ માટે સંપૂર્ણ ડિજિટલ સમાધાન', canvas.width / 2, 560);
}

// Download certificate
function downloadCertificate(format) {
    const canvas = document.getElementById('certificateCanvas');
    
    if (format === 'png') {
        const link = document.createElement('a');
        link.download = `certificate_${studentInfo.name}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } else if (format === 'pdf') {
        // For PDF, we'll use the canvas as image
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `certificate_${studentInfo.name}_${Date.now()}.png`;
        link.href = imgData;
        link.click();
        
        alert('PDF ડાઉનલોડ માટે PNG ફાઈલ સેવ કરવામાં આવી છે');
    }
}

// Share certificate
function shareCertificate() {
    const canvas = document.getElementById('certificateCanvas');
    canvas.toBlob(blob => {
        const file = new File([blob], 'certificate.png', { type: 'image/png' });
        
        if (navigator.share) {
            navigator.share({
                title: 'My Quiz Certificate',
                text: `મેં ${quizData.subject} Quiz માં ${studentInfo.name} સ્કોર કર્યો: ${document.getElementById('scoreValue').textContent}`,
                files: [file]
            }).catch(err => console.log('Share failed:', err));
        } else {
            // WhatsApp fallback
            canvas.toDataURL('image/png', (dataUrl) => {
                const text = `મેં ${quizData.subject} Quiz માં સ્કોર કર્યો: ${document.getElementById('scoreValue').textContent}\n\nOnline Education Guru`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    });
}

// Retake quiz
function retakeQuiz() {
    location.reload();
}

// Go home
function goHome() {
    window.location.href = '../index.html';
}
