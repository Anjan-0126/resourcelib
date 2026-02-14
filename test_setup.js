const sequelize = require('./database');
const User = require('./models/User');
const Resource = require('./models/Resource');

async function testSetup() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await sequelize.sync({ force: true }); // Re-create tables
        console.log('All models were synchronized successfully.');

        // visual check
        console.log('User model:', User === sequelize.models.User);
        console.log('Resource model:', Resource === sequelize.models.Resource);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

testSetup();
