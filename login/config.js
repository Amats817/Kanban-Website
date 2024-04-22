const mongoose = require('mongoose');

// MongoDB connection
const connect = mongoose.connect("mongodb://localhost:27017/project-manager");

// Check db connection and handle errors
connect.then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.error("Database Connection Error:", err);
});

// Create login schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' // Reference to the Task model
    }]
});

const taskSchema = new mongoose.Schema({
    location: {
        type: String,
        enum: ['TODO', 'DOING', 'FINISHED'],
        default: 'TODO'
    },
    text: {
        type: String,
        required: true
    }
});

// Collection model
const UserModel = mongoose.model("User", Loginschema);
const BoardModel = mongoose.model("Board", boardSchema);
const TaskModel = mongoose.model("Task", taskSchema);

module.exports = { UserModel, BoardModel, TaskModel };
