import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TodoForm from './TodoForm';
import api from '../utils/api'; 

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const addTask = async (name) => {
    try {
      const res = await api.post('/tasks', { name });
      setTasks([res.data, ...tasks]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await api.put(`/tasks/${id}`, {});
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div>
      <div className="header">
        <h1>To-Do List</h1>
        <button onClick={logout}>Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <TodoForm onAddTask={addTask} />
      <ul>
        {tasks.map(task => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(task._id)}>{task.name}</span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;