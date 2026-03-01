// Authentication JavaScript

let selectedUserType = 'student';

// Select user type
function selectUserType(type) {
    selectedUserType = type;
    document.getElementById('userType').value = type;
    
    // Update button states
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide fields based on type
    const teacherFields = document.getElementById('teacherFields');
    const studentFields = document.getElementById('studentFields');
    
    if (teacherFields && studentFields) {
        if (type === 'teacher') {
            teacherFields.style.display = 'block';
            studentFields.style.display = 'none';
            // Make teacher fields required
            document.getElementById('diasCode').required = true;
            document.getElementById('email').required = true;
        } else {
            teacherFields.style.display = 'none';
            studentFields.style.display = 'block';
            // Remove required from teacher fields
            if (document.getElementById('diasCode')) {
                document.getElementById('diasCode').required = false;
            }
            if (document.getElementById('email')) {
                document.getElementById('email').required = false;
            }
        }
    }
}

// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const mobile = document.getElementById('mobile').value;
        const userType = document.getElementById('userType').value;
        
        // Validate mobile
        if (!validateMobile(mobile)) {
            showError('કૃપા કરીને માન્ય મોબાઈલ નંબર દાખલ કરો', 'mobileError');
            return;
        }
        
        // Show loading
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.querySelector('.btn-text').style.display = 'none';
        loginBtn.querySelector('.btn-loader').style.display = 'inline';
        
        try {
            const response = await postData(API_ENDPOINTS.LOGIN_USER, {
                action: 'loginUser',
                mobile: mobile,
                userType: userType
            });
            
            if (response && response.success) {
                saveUser(response.user);
                showMessage('લોગિન સફળ! રીડાયરેક્ટ થઈ રહ્યું છે...', 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showMessage(response.message || 'લોગિન નિષ્ફળ રહ્યું', 'error');
            }
        } catch (error) {
            showMessage('સર્વર સાથે જોડાણ થઈ શક્યું નથી', 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.querySelector('.btn-text').style.display = 'inline';
            loginBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });
}

// Register Form Handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            action: 'registerUser',
            userType: document.getElementById('userType').value,
            name: document.getElementById('name').value,
            school: document.getElementById('school').value,
            mobile: document.getElementById('mobile').value
        };
        
        // Validate mobile
        if (!validateMobile(formData.mobile)) {
            showError('કૃપા કરીને માન્ય 10 અંકનો મોબાઈલ નંબર દાખલ કરો', 'mobileError');
            return;
        }
        
        // Add type-specific fields
        if (formData.userType === 'teacher') {
            formData.diasCode = document.getElementById('diasCode').value;
            formData.email = document.getElementById('email').value;
            
            if (!validateEmail(formData.email)) {
                showError('કૃપા કરીને માન્ય ઈમેલ દાખલ કરો', 'emailError');
                return;
            }
        } else {
            formData.standard = document.getElementById('standard').value;
        }
        
        // Show loading
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.disabled = true;
        registerBtn.querySelector('.btn-text').style.display = 'none';
        registerBtn.querySelector('.btn-loader').style.display = 'inline';
        
        try {
            const response = await postData(API_ENDPOINTS.REGISTER_USER, formData);
            
            if (response && response.success) {
                if (formData.userType === 'teacher') {
                    showMessage('રજિસ્ટ્રેશન સફળ! કૃપા કરીને તમારા ઈમેલ પર મોકલેલ OTP વડે વેરિફાય કરો.', 'success');
                    document.getElementById('otpSection').style.display = 'block';
                } else {
                    showMessage('રજિસ્ટ્રેશન સફળ! લોગિન પેજ પર રીડાયરેક્ટ થઈ રહ્યું છે...', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }
            } else {
                showMessage(response.message || 'રજિસ્ટ્રેશન નિષ્ફળ રહ્યું', 'error');
            }
        } catch (error) {
            showMessage('સર્વર સાથે જોડાણ થઈ શક્યું નથી', 'error');
        } finally {
            registerBtn.disabled = false;
            registerBtn.querySelector('.btn-text').style.display = 'inline';
            registerBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });
}

// Show message helper
function showMessage(message, type) {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = type === 'success' ? 'success-message' : 'error-message';
    div.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 5000);
}

// Show error in specific field
function showError(message, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

// Resend OTP
async function resendOTP() {
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    
    if (!email || !mobile) {
        showMessage('કૃપા કરીને ઈમેલ અને મોબાઈલ નંબર દાખલ કરો', 'error');
        return;
    }
    
    showMessage('OTP મોકલી રહ્યા છીએ...', 'success');
    
    // Call API to resend OTP
    // Implementation depends on your backend
}

// Mobile number validation on input
document.addEventListener('DOMContentLoaded', function() {
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length === 10) {
                document.getElementById('mobileError').textContent = '';
            }
        });
    }
});
