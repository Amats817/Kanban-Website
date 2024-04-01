document.addEventListener('DOMContentLoaded', function() {
    const registrationPage = document.getElementById('registration-page');
    const registrationForm = document.getElementById('registration-form');
    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUsername = newUsernameInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        if (newUsername === '' || newPassword === '') {
            alert('Please enter both username and password for registration.');
            return;
        }
        // Registration logic here
        registrationPage.style.display = 'none';
        // Redirect or show success message, etc.
    });
});
