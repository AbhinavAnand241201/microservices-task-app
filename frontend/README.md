# TaskMaster Frontend

A modern React TypeScript frontend for the TaskMaster microservices application.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Real-time Updates**: Automatic task list refresh after operations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a sleek, professional look

## Tech Stack

- **React 18** with TypeScript
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **React Hooks** for state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API Integration

The frontend connects to the microservices backend through the API Gateway at `http://localhost:8000`:

- **Authentication**: `/users/login`, `/users/register`
- **Tasks**: `/tasks` (CRUD operations)

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── TaskListScreen.tsx
│   └── TaskItem.tsx
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── index.css          # Global styles with Tailwind
```

## Environment

Make sure the microservices backend is running before starting the frontend:

```bash
# In the microservices root directory
docker-compose up -d
```

The frontend will automatically connect to the API Gateway at `localhost:8000`.