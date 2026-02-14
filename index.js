const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./database');
const User = require('./models/User');
const Resource = require('./models/Resource');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');

const app = express();
module.exports = app; // Export for Vercel

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key_here', // In production, use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Globals for Views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);

// Home Route
app.get('/', (req, res) => {
    res.redirect('/resources');
});

// Dashboard Route (Protected)
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');

    try {
        const userResources = await Resource.findAll({
            where: { created_by: req.session.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.render('dashboard', { title: 'Dashboard', user: req.session.user, resources: userResources });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Server Error');
    }
});

// Debug Route (Remove in production if sensitive)
app.get('/debug', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'ok',
            database: 'connected (SQLite)',
            env: process.env.RENDER ? 'render' : 'local',
            storage: 'local file (database.sqlite)'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            stack: error.stack
        });
    }
});

// DB Synchronization Promise
const dbReady = sequelize.sync({ force: false })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Database sync error:', err));

// Middleware to ensure DB is ready before request
app.use(async (req, res, next) => {
    try {
        await dbReady;
        next();
    } catch (error) {
        console.error('DB Init Error:', error);
        res.status(500).send('Database Initialization Failed');
    }
});

// Start Server (Only locally, Vercel handles this automatically)
if (require.main === module) {
    dbReady.then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    });
}
