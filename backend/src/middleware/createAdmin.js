const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../users/user.model');

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://admin:r2327@e-commerce.jdumw.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=E-commerce', { useNewUrlParser: true, useUnifiedTopology: true });

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        // Create a new admin user
        const hashedPassword = await bcrypt.hash('admin_password', 10);  // Change password as needed
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();
