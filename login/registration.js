document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const registrationMessage = document.getElementById('registration-message');

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: newUsername, password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = 'login.html';
            } else {
                registrationMessage.textContent = data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            registrationMessage.textContent = 'An error occurred. Please try again later.';
        }
    });
});