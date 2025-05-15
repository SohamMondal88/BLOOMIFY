document.addEventListener('DOMContentLoaded', function() {
    // Common elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Form validation for login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Authenticate user
            authenticateUser(email, password);
        });
    }
    
    // Form validation for registration
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showAlert('You must agree to the terms and conditions', 'error');
                return;
            }
            
            // Register user
            registerUser(fullName, email, password);
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            showAlert(`Redirecting to ${provider} login...`, 'info');
            // In a real app, you would redirect to the provider's auth page
        });
    });
    
    // Authenticate user with backend
    async function authenticateUser(email, password) {
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        submitButton.disabled = true;
        
        try {
            // In a real application, you would make an actual API call here
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            
            // Store the authentication token
            localStorage.setItem('bloomifyToken', data.token);
            
            // Store user data if needed
            if (data.user) {
                localStorage.setItem('bloomifyUser', JSON.stringify(data.user));
            }
            
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect to account dashboard
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Invalid email or password', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    // Register new user
    async function registerUser(fullName, email, password) {
        // Show loading state
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitButton.disabled = true;
        
        try {
            // In a real application, you would make an actual API call here
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, password })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
            
            const data = await response.json();
            
            showAlert('Registration successful! Welcome to Bloomify.', 'success');
            
            // Auto-login after registration if desired
            localStorage.setItem('bloomifyToken', data.token);
            if (data.user) {
                localStorage.setItem('bloomifyUser', JSON.stringify(data.user));
            }
            
            // Redirect to account dashboard
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            showAlert(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Style the alert
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.padding = '15px 20px';
        alert.style.borderRadius = '8px';
        alert.style.color = 'white';
        alert.style.fontWeight = '500';
        alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        alert.style.zIndex = '1000';
        alert.style.animation = 'slideIn 0.3s ease-out';
        
        // Set background color based on type
        if (type === 'error') {
            alert.style.backgroundColor = '#f44336';
        } else if (type === 'success') {
            alert.style.backgroundColor = '#4CAF50';
        } else {
            alert.style.backgroundColor = '#2196F3';
        }
        
        document.body.appendChild(alert);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .fa-spinner {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
});