// File: api-gateway/index.js

const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const axios = require('axios'); // Used for clean internal HTTP requests

const PORT = 8000;

async function startServer() {
    const app = express();

    // --- Middleware (Unchanged) ---
    app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:8000'], credentials: true }));
    app.use(express.json());

    // --- GraphQL Setup ---

    // 1. Define the full GraphQL schema with the new cross-service relationship
    const typeDefs = gql`
      type User {
        _id: ID!
        name: String!
        email: String!
      }

      type Task {
        _id: ID!
        title: String!
        description: String
        status: String
        userId: String!
        user: User # <-- The powerful relationship field that links to the User type
      }

      type Query {
        getTasks: [Task]
      }
      
      type Mutation {
          createTask(title: String!, description: String): Task
      }
    `;

    // 2. Define the resolvers that fetch and stitch data from our REST microservices
    const resolvers = {
      Query: {
        getTasks: async (_, __, { req }) => {
            try {
                const token = req.headers.authorization;
                // Make an internal REST call to the task-service
                const response = await axios.get('http://task-service:3002/tasks', { 
                    headers: { Authorization: token } 
                });
                return response.data;
            } catch (error) {
                console.error("getTasks Error:", error.response ? error.response.data : error.message);
                throw new Error("Failed to fetch tasks.");
            }
        },
      },
      Mutation: {
          createTask: async (_, { title, description }, { req }) => {
            try {
                const token = req.headers.authorization;
                // Make an internal REST call to the task-service
                const response = await axios.post('http://task-service:3002/tasks', 
                    { title, description }, 
                    { headers: { Authorization: token } }
                );
                return response.data;
            } catch(error) {
                console.error("createTask Error:", error.response ? error.response.data : error.message);
                throw new Error("Failed to create task.");
            }
          },
      },
      
      // ***** This is the most important part of our advanced feature *****
      // 3. This resolver populates the 'user' field for any Task object.
      Task: {
        user: async (parentTask) => {
          // 'parentTask' is the task object (e.g., from the getTasks query)
          try {
            const userId = parentTask.userId;
            // Make a second, internal REST call to the user-service to fetch the user's details
            const response = await axios.get(`http://user-service:3001/users/${userId}`);
            return response.data; // This data will populate the 'user' field in the final GraphQL response
          } catch(error) {
            console.error("User lookup for task failed:", error.message);
            return null; // Return null if the user can't be found for some reason
          }
        }
      }
    };

    // 4. Create and start Apollo Server, passing the request context through
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context: ({ req }) => ({ req }) // This makes the incoming HTTP request object available in our resolvers
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // --- REST API Proxy Setup (Unchanged) ---
    app.use('/users', proxy('http://user-service:3001'));
    app.use('/tasks', proxy('http://task-service:3002', { proxyReqPathResolver: (req) => req.originalUrl }));

    app.listen(PORT, () => {
        console.log(`API Gateway listening on port ${PORT}`);
        console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
}

startServer();
