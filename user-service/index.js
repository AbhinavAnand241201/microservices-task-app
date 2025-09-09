// File: user-service/index.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user"); // This line needs the User.js model file
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = "your_super_super_secret_key_that_is_very_long_and_secure";

app.use(bodyParser.json());

// --- RabbitMQ Connection ---
const RABBITMQ_URL = "amqp://rabbitmq:5672";
let channel, connection;

async function connectToRabbitMQ() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue("user-created");
        console.log("User-Service connected to RabbitMQ.");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        setTimeout(connectToRabbitMQ, 5000); // Retry connection
    }
}
connectToRabbitMQ();

// --- MongoDB Connection ---
mongoose.connect("mongodb://mongodb/user-service-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("User-Service DB Connected");
}).catch(err => {
    console.error("DB Connection Error:", err);
});


// --- API Endpoints ---
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        // Sanitize the event message to not include the password
        const userEventData = { id: newUser._id, email: newUser.email, name: newUser.name };

        if (channel) {
            channel.sendToQueue("user-created", Buffer.from(JSON.stringify(userEventData)));
        } else {
            console.log("RabbitMQ channel not available. Message not sent.");
        }
        
        // Sanitize the API response
        const userResponse = { _id: newUser._id, name: newUser.name, email: newUser.email, created_at: newUser.created_at };
        res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Logged in successfully", token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


app.listen(PORT, () => {
    console.log(`User-Service listening on port ${PORT}`);
});

