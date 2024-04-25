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

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const result = await response.json();
                alert(result.message);
                console.log('Redirecting...');

                localStorage.setItem('currentUser', name);

                window.location.href = result.redirectTo;
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred during login');
            }
        });
    }
   
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const role = document.getElementById('new-role').value; 

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, password, role }) 
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    
                } else {
                    alert(result.error || 'Registration failed');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('An error occurred during registration');
            }
        });
    }
});