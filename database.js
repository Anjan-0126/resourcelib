const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Simple SQLite Setup
// Works Locally and on Render (Ephemeral)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

// Test connection immediately
sequelize.authenticate()
    .then(() => console.log('Database connected (SQLite)...'))
    .catch(err => console.error('Error: ' + err));

module.exports = sequelize;
