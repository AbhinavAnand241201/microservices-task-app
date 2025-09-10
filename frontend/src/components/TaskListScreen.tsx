import React, { useState } from 'react';
import { Task, TaskFormData, TaskUpdateData } from '../types';
import TaskItem from './TaskItem';

interface TaskListScreenProps {
  tasks: Task[];
  onLogout: () => void;
  onAddTask: (taskData: TaskFormData) => void;
  onUpdateTask: (taskId: string, updates: TaskUpdateData) => void;
  onDeleteTask: (taskId: string) => void;
  loading: boolean;
}

const TaskListScreen: React.FC<TaskListScreenProps> = ({
  tasks,
  onLogout,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  loading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-bold transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-2xl mb-8">
        <h3 className="text-xl font-bold mb-4">Add a New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            required
            className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={2}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 p-3 rounded-md font-bold transition-colors disabled:bg-slate-600"
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        {loading && tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-4">
            You have no tasks yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskListScreen;