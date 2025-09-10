import React, { useState } from 'react';
import { Task, TaskUpdateData } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: TaskUpdateData) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const isDone = task.status === 'Done';

  const handleToggleStatus = () => {
    const newStatus = isDone ? 'To Do' : 'Done';
    onUpdate(task._id, { status: newStatus });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  return (
    <div
      className={`bg-slate-800 p-4 rounded-lg shadow-lg transition-all ${
        isDone ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            onClick={handleToggleStatus}
            className={`w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center ${
              isDone
                ? 'bg-green-500 border-green-400'
                : 'border-slate-500 hover:border-sky-400'
            }`}
          >
            {isDone && <span className="text-white text-xs">✓</span>}
          </button>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-700 p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-700 p-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-bold transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-slate-600 hover:bg-slate-700 px-3 py-1 rounded text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p
                  className={`font-bold ${
                    isDone ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-slate-400 mt-1">
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleEdit}
              className="text-blue-400 hover:text-blue-200 font-bold px-2 py-1 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-400 hover:text-red-200 font-bold px-2 py-1 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
