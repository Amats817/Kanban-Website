const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const UserModel = require('./config');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/login-system", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registration.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

// API endpoint for user login
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await UserModel.findOne({ name, password });
        if (user) {
            res.sendFile(path.join(__dirname, '/public/dashboard.html'));
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API endpoint for user registration
app.post('/register', async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ name });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
        } else {
            const newUser = new UserModel({ name, password });
            await newUser.save();
            res.json({ message: 'Registration successful', user: newUser });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});