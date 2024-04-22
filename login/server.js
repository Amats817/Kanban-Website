const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { UserModel, BoardModel, TaskModel } = require('./config');
const { isAdmin, isAuthenticated } = require('./middlewares'); // Import the middleware functions

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/project-manager", { useNewUrlParser: true, useUnifiedTopology: true })
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

// API endpoint for creating a new board
app.post('/api/boards', isAuthenticated, isAdmin, async (req, res) => {
    try {
        // Extract board details from the request body
        const { title, owner } = req.body;

        // Create a new board
        const newBoard = await BoardModel.create({ title, owner });

        if (!newBoard) {
            throw new Error('Failed to create board');
        }

        res.status(201).json({ message: 'Board created successfully', board: newBoard });
    } catch (err) {
        console.error('Error creating board:', err);
        res.status(500).json({ error: 'Board creation failed' });
    }
});

// API endpoint for creating a new task in a board
app.post('/api/boards/:boardId/tasks', isAuthenticated, async (req, res) => {
    try {
        const { title, status } = req.body;
        const boardId = req.params.boardId;
        
        // Check if the board exists
        const board = await BoardModel.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        // Create a new task
        const newTask = await TaskModel.create({ title, status, board: boardId });
        board.tasks.push(newTask);
        await board.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Task creation failed' });
    }
});

// API endpoint for updating a task
app.put('/api/tasks/:taskId', isAuthenticated, async (req, res) => {
    try {
        const { title, status } = req.body;
        const taskId = req.params.taskId;

        // Find the task by ID and update it
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { title, status }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Task update failed' });
    }
});

// API endpoint for deleting a task
app.delete('/api/tasks/:taskId', isAuthenticated, async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // Find the task by ID and delete it
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Remove the task reference from its board
        const board = await BoardModel.findByIdAndUpdate(deletedTask.board, { $pull: { tasks: taskId } });

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Task deletion failed' });
    }
});

// API endpoint for user login
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await UserModel.findOne({ name, password });

        if (user) {
            // Assuming the role is stored in the user object as "role"
            res.status(200).json({ message: 'Login successful', username: user.name, role: user.role, redirectTo: user.role === 'admin' ? '/adminboard.html' : '/dashboard.html' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API endpoint for user registration
app.post('/register', async (req, res) => {
    const { name, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user with name, password, and role
        const newUser = new UserModel({ name, password, role });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});