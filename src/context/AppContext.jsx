import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, getTheme, saveTheme } from '../utils/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSession();
    if (saved) setSession(saved);
    const savedTheme = getTheme();
    setTheme(savedTheme);
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const login = (sessionData) => {
    saveSession(sessionData);
    setSession(sessionData);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    saveTheme(next);
    setTheme(next);
  };

  return (
    <AppContext.Provider value={{ session, login, logout, theme, toggleTheme, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
