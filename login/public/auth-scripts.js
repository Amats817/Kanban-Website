document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, password })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(result.error || 'Login failed');
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, password })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    // Redirect or do something based on the response
                } else {
                    alert(result.error || 'Registration failed');
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }
});