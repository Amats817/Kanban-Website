const mongoose = require('mongoose');

// MongoDB connection
const connect = mongoose.connect("mongodb://localhost:27017/login-system");

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
    }
});

// Collection model
const UserModel = mongoose.model("User", Loginschema);

module.exports = UserModel;
