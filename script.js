document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const rememberCheckbox = document.getElementById('remember');

    // Static user credentials with their specific dashboard URLs
    const validUsers = [
        { username: 'admin1', password: 'admin1', dashboard: 'dashboard-admin1.html' },
        { username: 'admin2', password: 'admin2', dashboard: 'dashboard-admin2.html' },
        { username: 'admin3', password: 'admin3', dashboard: 'dashboard-admin3.html' }
    ];

    // Check if there are saved credentials
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
        rememberCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!username.trim()) {
            showError('Veuillez entrer un nom d\'utilisateur');
            return;
        }

        if (password.length < 4) {
            showError('Le mot de passe doit contenir au moins 4 caractères');
            return;
        }

        // Check credentials against static users
        const user = validUsers.find(u => u.username === username && u.password === password);

        if (user) {
            // Handle "Remember me" functionality
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            // Store user data
            localStorage.setItem('user', JSON.stringify({ 
                username: user.username,
                dashboard: user.dashboard
            }));
            
            // Clear any previous error messages
            errorMessage.textContent = '';
            
            // Redirect to specific admin dashboard
            window.location.href = user.dashboard;
        } else {
            showError('Nom d\'utilisateur ou mot de passe incorrect');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}); 