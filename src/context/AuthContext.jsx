import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.userDto);
      setToken(data.accessToken);
      return data.userDto;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user && user.email) {
      try {
        const freshUser = await userService.getUserByEmail(user.email);
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch (e) {
        console.error('Failed to refresh user profile', e);
      }
    }
  };

  // Roles in backend could be ROLE_ADMIN / ROLE_USER, but we match both ROLE_ prefix and pure string
  const isAdmin = user && user.role && user.role.some(r => r.name === 'ROLE_ADMIN' || r.name === 'ADMIN');
  const isUser = user && user.role && user.role.some(r => r.name === 'ROLE_USER' || r.name === 'USER');

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin,
    isUser,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
