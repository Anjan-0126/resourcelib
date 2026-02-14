const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User'); // Import User model to define association

const Resource = sequelize.define('Resource', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('article', 'book', 'video', 'other'),
        defaultValue: 'other'
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: { // URL to resource or content itself
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    }
});

// Association: A Resource belongs to a User (created_by)
Resource.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Resource, { foreignKey: 'created_by' });

module.exports = Resource;
