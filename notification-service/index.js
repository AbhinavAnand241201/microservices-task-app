// File: notification-service/index.js

const express = require("express");
const amqp = require("amqplib");

const app = express();
const PORT = process.env.PORT || 3003;

// RabbitMQ connection details
const RABBITMQ_URL = "amqp://rabbitmq:5672";
let channel, connection;

// Function to connect to RabbitMQ and start consuming messages
async function connectAndConsume() {
    try {
        // Connect to RabbitMQ server
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Assert a queue to make sure it exists
        await channel.assertQueue("user-created");

        console.log("Notification-Service waiting for messages in 'user-created' queue...");

        // Consume messages from the queue
        channel.consume("user-created", (data) => {
            const newUser = JSON.parse(data.content);
            console.log("Received new user registration:", newUser);
            
            // Here you would typically have logic to send an email, push notification, etc.
            // For now, we just log it.

            // Acknowledge the message was processed
            channel.ack(data);
        });
    } catch (error) {
        console.error("Error connecting to RabbitMQ or consuming messages:", error);
        // Implement retry logic if necessary
        setTimeout(connectAndConsume, 5000); // Retry after 5 seconds
    }
}

// Start the server and the message consumer
app.listen(PORT, () => {
    console.log(`Notification-Service listening on port ${PORT}`);
    connectAndConsume();
});
