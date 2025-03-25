const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Admin users data
const ADMIN_USERS = {
    admin1: {
        username: 'admin1',
        password: 'admin1',
        role: 'admin1',
        name: 'Admin 1'
    },
    admin2: {
        username: 'admin2',
        password: 'admin2',
        role: 'admin2',
        name: 'Admin 2'
    },
    admin3: {
        username: 'admin3',
        password: 'admin3',
        role: 'admin3',
        name: 'Admin 3'
    },
    admin4: {
        username: 'admin4',
        password: 'admin4',
        role: 'admin4',
        name: 'Admin 4'
    }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = ADMIN_USERS[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Create token with user role
    const token = jwt.sign(
        { 
            username: user.username,
            role: user.role,
            name: user.name
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Connexion réussie',
        token,
        user: {
            username: user.username,
            role: user.role,
            name: user.name
        }
    });
});

// Get user dashboard data
app.get('/api/dashboard/:role', authenticateToken, (req, res) => {
    const { role } = req.params;
    
    // Check if user has access to this dashboard
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Return dashboard data based on role
    const dashboardData = {
        admin1: {
            title: 'Tableau de bord Admin 1',
            welcomeMessage: 'Bienvenue Admin 1',
            stats: {
                totalInvoices: 150,
                pendingInvoices: 25,
                completedInvoices: 125
            }
        },
        admin2: {
            title: 'Tableau de bord Admin 2',
            welcomeMessage: 'Bienvenue Admin 2',
            stats: {
                totalInvoices: 200,
                pendingInvoices: 30,
                completedInvoices: 170
            }
        },
        admin3: {
            title: 'Tableau de bord Admin 3',
            welcomeMessage: 'Bienvenue Admin 3',
            stats: {
                totalInvoices: 180,
                pendingInvoices: 20,
                completedInvoices: 160
            }
        },
        admin4: {
            title: 'Tableau de bord Admin 4',
            welcomeMessage: 'Bienvenue Admin 4',
            stats: {
                totalInvoices: 220,
                pendingInvoices: 35,
                completedInvoices: 185
            }
        }
    };

    res.json(dashboardData[role]);
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 