import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api'; // Import the new api instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use the api instance for the initial check
      api.get('/tasks') // A simple authenticated endpoint to verify token validity
        .then(() => {
          setUser({ token }); // If successful, set user
        })
        .catch(() => {
          localStorage.removeItem('token'); // If token is invalid, remove it
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Use the api instance
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const register = async (email, password) => {
    try {
      // Use the api instance
      const res = await api.post('/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
