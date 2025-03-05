const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const router = express.Router();

// Admin registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await User.findOne({ email, role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create new admin
        const newAdmin = new User({
            username,
            email,
            password, // The password will be hashed automatically by the pre-save hook
            role: 'admin'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin user by email
        const user = await User.findOne({ email, role: 'admin' });

        if (!user) {
            return res.status(400).json({ message: 'Admin user not found' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expiration time
        );

        // Return the token
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to authenticate admin using JWT token
const authenticateAdmin = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }
    console.log("Token Extracted in Admin Routes:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded Admin Routes Token:", decoded);
        req.user = decoded;
        
        // Ensure the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden, not an admin' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Add routes that require admin authentication
router.use(authenticateAdmin);

// Example admin-only route
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;
