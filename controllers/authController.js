// frontend/src/controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Basic validation (add more as needed)
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Validate password (assuming you have a method to compare hashed passwords)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Login failed.', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
