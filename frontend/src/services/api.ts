import axios from 'axios';

// API Gateway URL - this is where all requests go
const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid, clear it
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    console.log('AuthService: Attempting login with:', credentials);
    try {
      const response = await api.post('/users/login', credentials);
      console.log('AuthService: Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    console.log('AuthService: Attempting registration with:', userData);
    try {
      const response = await api.post('/users/register', userData);
      console.log('AuthService: Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthService: Registration error:', error);
      throw error;
    }
  },
};

export const taskService = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  createTask: async (taskData: { title: string; description: string }) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (taskId: string, updates: { title?: string; description?: string; status?: string }) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

export default api;
