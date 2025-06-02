document.addEventListener('DOMContentLoaded', function() {
    // Handle success popup
    const successPopup = document.querySelector('.success-popup');
    if (successPopup) {
        setTimeout(function() {
            successPopup.style.display = 'none';
        }, 5000);
    }
    
    // Handle error popup
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        setTimeout(function() {
            errorMessage.style.opacity = '0';
            setTimeout(function() {
                errorMessage.style.display = 'none';
            }, 1000);
        }, 5000);
    }
    
    // Add form validation
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;
            
            if (!email || !password) {
                event.preventDefault();
                showError('Email and password are required');
            }
        });
    }
    
    // Error display helper
    function showError(message) {
        let errorDiv = document.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            const title = document.querySelector('.login-subtitle');
            title.after(errorDiv);
        }
        
        errorDiv.innerHTML = '<strong>Error:</strong> ' + message;
        errorDiv.style.display = 'block';
        errorDiv.style.opacity = '1';
    }
});
