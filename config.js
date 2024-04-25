const mongoose = require('mongoose');

const connect = mongoose.connect("mongodb://localhost:27017/project-manager");

connect.then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.error("Database Connection Error:", err);
});

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
        type: String,
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' 
    }]
});


const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['todo', 'doing', 'finished'],
        default: 'todo'
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    }
});

const UserModel = mongoose.model("User", Loginschema);
const BoardModel = mongoose.model("Board", boardSchema);
const TaskModel = mongoose.model("Task", taskSchema);

module.exports = { UserModel, BoardModel, TaskModel };
