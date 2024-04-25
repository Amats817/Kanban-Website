const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { UserModel, BoardModel, TaskModel } = require('./config');
const { ObjectId } = require('mongoose').Types;

const app = express();
const PORT = 3000;

// parse JSON requests
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/project-manager", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

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

// create new boards
app.post('/api/boards', async (req, res) => {
    try {
        const { title, owner } = req.body;

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

// fetch boards
app.get('/api/boards', async (req, res) => {
    try {
        const boards = await BoardModel.find().populate('tasks');
        res.json(boards);
    } catch (err) {
        console.error('Error fetching boards:', err);
        res.status(500).json({ error: 'Failed to fetch boards' });
    }
});


// deleting board
app.delete('/api/boards/:boardId', async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const deletedBoard = await BoardModel.findByIdAndDelete(boardId);

        if (!deletedBoard) {
            return res.status(404).json({ error: 'Board not found' });
        }

        res.status(200).json({ message: 'Board deleted successfully', board: deletedBoard });
    } catch (err) {
        console.error('Error deleting board:', err);
        res.status(500).json({ error: 'Board deletion failed' });
    }
});

// saving tasks
app.post('/api/save-tasks', async (req, res) => {
    try {
      const tasksArray = Object.values(req.body);
  
      if (!Array.isArray(tasksArray)) {
        throw new Error('Invalid tasks format');
      }
  
      if (tasksArray.length > 0) {
        tasksArray.forEach(task => {
          if (!task.text || !task.status || !task.boardId) {
            throw new Error('Invalid task format');
          }
        });
  
        console.log('Tasks to be saved:', tasksArray);
  
        const deleteResult = await TaskModel.deleteMany({ boardId: tasksArray[0].boardId });
        console.log('Delete result:', deleteResult);
  
        const savedTasks = await TaskModel.insertMany(tasksArray);
  
        res.status(201).json({ message: 'Tasks saved successfully', tasks: savedTasks });
      } else {
        res.status(200).json({ message: 'No tasks provided' });
      }
    } catch (err) {
      console.error('Error saving tasks:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // fetching task
  app.get('/api/tasks', async (req, res) => {
    try {
        const boardId = req.query.boardId;

        if (!boardId) {
            return res.status(400).json({ error: 'Board ID is required' });
        }

        const tasks = await TaskModel.find({ boardId });

        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// login
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

// registration
app.post('/register', async (req, res) => {
    const { name, password, role } = req.body;

    try {
        const existingUser = await UserModel.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

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