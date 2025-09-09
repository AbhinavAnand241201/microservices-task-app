# File: task-service/Dockerfile

# 1. Specify the base image
FROM node:18

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of the application source code
COPY . .

# 6. Expose the port the app runs on
EXPOSE 3002

# 7. Define the command to start the app
CMD [ "npm", "start" ]
