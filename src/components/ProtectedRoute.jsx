import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const StudentRoute = ({ children }) => {
  const { session, loading } = useApp();
  if (loading) return null;
  if (!session) return <Navigate to="/student/login" replace />;
  if (session.role !== 'student') return <Navigate to="/" replace />;
  return children;
};

export const FacultyRoute = ({ children }) => {
  const { session, loading } = useApp();
  if (loading) return null;
  if (!session) return <Navigate to="/faculty/login" replace />;
  if (session.role !== 'faculty') return <Navigate to="/" replace />;
  return children;
};
