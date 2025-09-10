










TaskMaster: An Advanced Microservices Project
TaskMaster is a full-stack, event-driven task management application built with a sophisticated microservices architecture. It serves as a practical demonstration of modern backend engineering principles, including containerization, inter-service communication, API design, and advanced data federation patterns.

This project goes beyond a simple CRUD application to showcase a robust, scalable, and secure system design suitable for complex, real-world applications.

Architecture Overview
The application is composed of several independent services that communicate with each other asynchronously via a message broker and expose a unified API to the outside world through an API Gateway. The entire system is containerized with Docker for consistency and ease of deployment.

Core Services:

User Service (Node.js & Express): Manages user registration and authentication. It is the single source of truth for user data and is responsible for issuing JWT tokens upon successful login.

Task Service (Node.js & Express): Handles all task-related logic (CRUD operations). It features a secure, resource-based API where users can only access and manage their own tasks.

Notification Service (Node.js): A lightweight, event-driven service that listens for messages from other services. In this project, it listens for user-created events to simulate sending a welcome notification, demonstrating a decoupled, asynchronous workflow.

API Gateway (Node.js & Express): The single, unified entry point for all external traffic. It intelligently routes incoming requests to the appropriate internal microservice and exposes both REST and GraphQL endpoints. This secures the internal services by hiding them from the public internet.

Infrastructure:

RabbitMQ: Acts as the message broker, enabling asynchronous, event-driven communication between services. This decouples the services, allowing them to evolve independently and making the system more resilient.

MongoDB: The primary NoSQL database, with a separate database instance for each service to ensure data isolation and independent scalability.

Docker & Docker Compose: The entire application is containerized, ensuring a consistent and reproducible development and production environment. Docker Compose is used to define and manage the multi-container setup, allowing the entire system to be brought online with a single command.

Key Features & Technical Highlights
This project was built to showcase a deep understanding of modern backend patterns and technologies.

Hybrid API Design (REST & GraphQL):

REST APIs are used for internal, service-to-service communication, providing a clear and simple command-based interface.

A GraphQL API is exposed through the gateway, offering a powerful and flexible data fetching layer for frontends.

JWT-Based Authentication: The system is secured using JSON Web Tokens. The User Service issues tokens, and the Task Service contains authentication middleware to protect its endpoints, ensuring that all data-related requests are authenticated and authorized.

The API Gateway Pattern: A single gateway provides a unified interface to the outside world, simplifying client-side development, centralizing cross-cutting concerns like CORS, and enhancing security by abstracting the internal network of microservices.

Advanced GraphQL Data Federation: The project's most impressive feature. The API Gateway's GraphQL layer can perform cross-service data aggregation. It can fulfill a single query (e.g., "get tasks and their user") by fetching data from the Task Service and then automatically making a subsequent request to the User Service to stitch the related data together, all in one API call.

Event-Driven & Decoupled Architecture: Services communicate via RabbitMQ, allowing for asynchronous operations. For example, when a user registers, the User Service simply publishes an event and moves on, while the Notification Service picks up the event independently. This creates a resilient and scalable system.

Externalized Configuration: All sensitive information (database URIs, JWT secrets, port numbers) is managed in .env files and is completely separate from the application code, following the best practices of a 12-Factor App.

How This Project Demonstrates My Skills
Developing TaskMaster showcases a comprehensive and practical understanding of the skills required for a modern backend engineering role:

Architectural Design: I can design and build a complex application from the ground up using a distributed, microservices architecture.

API Development: I am proficient in developing and securing both RESTful APIs and modern GraphQL APIs, and I understand when to use each paradigm.

Authentication & Security: I can implement robust, token-based authentication (JWT) and authorization to secure application endpoints and protect user data.

Containerization & DevOps: I have hands-on experience with Docker and Docker Compose to create reproducible, isolated, and scalable application environments.

Asynchronous Systems: I understand and can implement event-driven communication patterns using message brokers like RabbitMQ to build resilient and decoupled systems.

Advanced Problem-Solving: I can diagnose and debug complex, multi-service issues related to networking, data persistence, and configuration in a containerized environment.

Getting Started
Clone the repository.

Ensure you have Docker and Docker Compose installed on your machine.

From the root directory of the project, run the following command:

docker-compose up --build

The application will start, and the API Gateway will be available at http://localhost:8000.

Example API Usage (cURL)
Register a new user:

curl -X POST http://localhost:8000/users/register -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"a_secure_password"}'

Log in to get a token:

curl -X POST http://localhost:8000/users/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"a_secure_password"}'

Run the advanced GraphQL query (replace <TOKEN>):

curl -X POST http://localhost:8000/graphql \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{ "query": "{ getTasks { _id title user { name email } } }" }'
