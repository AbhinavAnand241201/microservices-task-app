import React, { useState, useEffect, useCallback } from 'react';
import { Task, LoginCredentials, RegisterCredentials, TaskFormData, TaskUpdateData } from './types';
import { authService } from './services/api';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// Import components
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import TaskListScreen from './components/TaskListScreen';

function App() {
  // State management
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'login' | 'register' | 'tasks'>('login');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const GET_TASKS = gql`
    query GetTasks {
      getTasks { _id title description status userId created_at }
    }
  `;

  const CREATE_TASK = gql`
    mutation CreateTask($title: String!, $description: String) {
      createTask(title: $title, description: $description) {
        _id title description status userId created_at
      }
    }
  `;

  const UPDATE_TASK = gql`
    mutation UpdateTask($id: ID!, $title: String, $description: String, $status: String) {
      updateTask(id: $id, title: $title, description: $description, status: $status) {
        _id title description status userId created_at
      }
    }
  `;

  const DELETE_TASK = gql`
    mutation DeleteTask($id: ID!) { deleteTask(id: $id) }
  `;

  const { data, loading: queryLoading, error: queryError, refetch } = useQuery<{ getTasks: Task[] }>(GET_TASKS, {
    skip: !token,
    fetchPolicy: 'cache-and-network',
  });

  const [createTaskMutation] = useMutation(CREATE_TASK, {
    onCompleted: () => refetch(),
  });

  const [updateTaskMutation] = useMutation(UPDATE_TASK, {
    onCompleted: () => refetch(),
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: () => refetch(),
  });

  // Load/refresh tasks when query returns or token changes
  useEffect(() => {
    if (token) {
      setView('tasks');
    } else {
      setView('login');
    }
  }, [token]);

  useEffect(() => {
    if (data?.getTasks) {
      setTasks(data.getTasks);
    }
  }, [data]);

  // Authentication handlers
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', credentials);
      const data = await authService.login(credentials);
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting registration with:', credentials);
      const response = await authService.register(credentials);
      console.log('Registration successful:', response);
      setView('login');
      setError(''); // Clear any previous errors
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
    setView('login');
  };

  // Task handlers
  const handleAddTask = async (taskData: TaskFormData) => {
    setLoading(true);
    setError('');
    try {
      await createTaskMutation({ variables: { title: taskData.title, description: taskData.description } });
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: TaskUpdateData) => {
    try {
      await updateTaskMutation({ variables: { id: taskId, ...updates } });
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskMutation({ variables: { id: taskId } });
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-400">TaskMaster</h1>
          <p className="text-slate-400">A Microservices-Powered Task App</p>
        </header>

        {(error || queryError) && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center mb-4">
            {error || queryError?.message}
          </div>
        )}

        {token ? (
          <TaskListScreen
            tasks={tasks}
            onLogout={handleLogout}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            loading={loading || queryLoading}
          />
        ) : (
          view === 'login' ? (
            <LoginScreen
              onLogin={handleLogin}
              onSwitchToRegister={() => setView('register')}
              loading={loading}
            />
          ) : (
            <RegisterScreen
              onRegister={handleRegister}
              onSwitchToLogin={() => setView('login')}
              loading={loading}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;