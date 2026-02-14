const { Sequelize } = require('sequelize');
const path = require('path');

const fs = require('fs');

let sequelize;

if (process.env.VERCEL) {
    // Vercel /tmp is the only writable directory
    const dbPath = path.join('/tmp', 'database.sqlite');
    // Copy the seed database from local source to /tmp if it doesn't exist
    // (Optional: this resets data on every cold start)
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false
    });
} else {
    // Local development
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, 'database.sqlite'),
        logging: false
    });
}

// Test connection immediately
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Error: ' + err));

module.exports = sequelize;
