document.addEventListener('DOMContentLoaded', function() {
    const loginPage = document.getElementById('login-page');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username === '' || password === '') {
            alert('Please enter both username and password.');
            return;
        }
        // Login logic here
        loginPage.style.display = 'none';
        // Redirect or show success message, etc.
    });
});
