// File: api-gateway/index.js

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

// The user service routing works correctly by default.
app.use('/users', proxy('http://user-service:3001'));

// ***** MODIFIED: Correctly forward the path for the task service *****
app.use('/tasks', proxy('http://task-service:3002', {
    // This function ensures that the original path is preserved.
    // e.g., a request to /tasks/123 is forwarded as /tasks/123, not /123.
    proxyReqPathResolver: function (req) {
        return req.originalUrl;
    }
}));


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});

