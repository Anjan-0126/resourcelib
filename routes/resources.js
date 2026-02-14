const express = require('express');
const Resource = require('../models/Resource');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// GET All Resources (Home Page uses this or similar logic, but this is API/Generic list)
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.findAll({
            include: [{ model: User, as: 'creator', attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.render('index', {
            title: 'Home - Resource Lib',
            resources,
            user: req.session.user
        });
    } catch (error) {
        console.error('Fetch resources error:', error);
        res.status(500).send('Server Error');
    }
});

// GET New Resource Page
router.get('/new', isAuthenticated, (req, res) => {
    res.render('new_resource', { title: 'Add New Resource', user: req.session.user });
});

// POST Create Resource
router.post('/', isAuthenticated, async (req, res) => {
    try {
        let { title, type, author, description, url } = req.body;

        // Convert empty url string to null to pass Sequelize validation
        if (url && url.trim() === '') {
            url = null;
        }

        await Resource.create({
            title,
            type,
            author,
            description,
            url,
            created_by: req.session.user.id
        });
        res.redirect('/resources'); // Redirect to list
    } catch (error) {
        console.error('Create resource error:', error);
        res.render('new_resource', { error: 'Failed to create resource', title: 'Add New Resource', user: req.session.user });
    }
});

// GET Single Resource
router.get('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id, {
            include: [{ model: User, as: 'creator', attributes: ['username'] }]
        });
        if (!resource) {
            return res.status(404).send('Resource not found');
        }
        res.render('resource_detail', { title: resource.title, resource, user: req.session.user });
    } catch (error) {
        console.error('Fetch resource error:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
