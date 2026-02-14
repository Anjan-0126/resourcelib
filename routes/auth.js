const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// GET Register Page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register - Resource Lib', user: req.session.user });
});

// POST Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Basic validation
        if (!username || !email || !password) {
            return res.render('register', { error: 'All fields are required', title: 'Register', user: req.session.user });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword
        });

        req.session.user = { id: newUser.id, username: newUser.username };
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', { error: 'Registration failed. Username or Email might be taken.', title: 'Register', user: req.session.user });
    }
});

// GET Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login - Resource Lib', user: req.session.user });
});

// POST Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.render('login', { error: 'Invalid email or password', title: 'Login', user: req.session.user });
        }

        req.session.user = { id: user.id, username: user.username };
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'An error occurred during login', title: 'Login', user: req.session.user });
    }
});

// GET Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Logout error:', err);
        res.redirect('/');
    });
});

module.exports = router;
