const sequelize = require('./database');
const User = require('./models/User');
const Resource = require('./models/Resource');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        // Check if admin user exists
        let admin = await User.findOne({ where: { email: 'admin@example.com' } });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                username: 'Admin',
                email: 'admin@example.com',
                password_hash: hashedPassword
            });
            console.log('Created admin user: admin@example.com / admin123');
        } else {
            console.log('Admin user already exists.');
        }

        // Add Resources
        const resources = [
            {
                title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
                type: 'book',
                author: 'Robert C. Martin',
                description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way.',
                url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
                created_by: admin.id
            },
            {
                title: 'The Pragmatic Programmer',
                type: 'book',
                author: 'Andrew Hunt and David Thomas',
                description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users.',
                url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
                created_by: admin.id
            },
            {
                title: 'MDN Web Docs',
                type: 'article',
                author: 'Mozilla',
                description: 'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.',
                url: 'https://developer.mozilla.org/en-US/',
                created_by: admin.id
            },
            {
                title: 'Refactoring UI',
                type: 'book',
                author: 'Adam Wathan & Steve Schoger',
                description: 'Learn how to design beautiful user interfaces by yourself using specific tactics explained from a developer\'s point-of-view.',
                url: 'https://www.refactoringui.com/',
                created_by: admin.id
            },
            {
                title: 'JavaScript: The Good Parts',
                type: 'book',
                author: 'Douglas Crockford',
                description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined.',
                url: 'https://www.oreilly.com/library/view/javascript-the-good/9780596517748/',
                created_by: admin.id
            }
        ];

        for (const res of resources) {
            const exists = await Resource.findOne({ where: { title: res.title } });
            if (!exists) {
                await Resource.create(res);
                console.log(`Added resource: ${res.title}`);
            }
        }

        console.log('Seeding completed successfully.');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
