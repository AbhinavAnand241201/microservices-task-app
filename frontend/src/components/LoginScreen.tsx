import React, { useState } from 'react';
import { LoginCredentials } from '../types';

interface LoginScreenProps {
  onLogin: (credentials: LoginCredentials) => void;
  onSwitchToRegister: () => void;
  loading: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister, loading }) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-400">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 p-3 rounded-md font-bold transition-colors disabled:bg-slate-600"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-slate-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-sky-400 hover:underline"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default LoginScreen;