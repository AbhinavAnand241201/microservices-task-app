// File: task-service/index.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = "your_super_super_secret_key_that_is_very_long_and_secure";

app.use(bodyParser.json());

// --- MongoDB Connection ---
mongoose.connect("mongodb://mongodb/task-service-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Task-Service DB Connected");
}).catch(err => {
    console.error("DB Connection Error:", err);
});

// --- Authentication Middleware ---
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- CRUD API Endpoints ---

// 1. Create a new task
app.post("/tasks", authenticate, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({
            title,
            description,
            userId: req.user.id // Link task to the authenticated user
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 2. Get all tasks for the authenticated user
app.get("/tasks", authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 3. Get a single task by ID
app.get("/tasks/:id", authenticate, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 4. Update a task by ID
app.put("/tasks/:id", authenticate, async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, description, status },
            { new: true } // Return the updated document
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 5. Delete a task by ID
app.delete("/tasks/:id", authenticate, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Task-Service listening on port ${PORT}`);
});
