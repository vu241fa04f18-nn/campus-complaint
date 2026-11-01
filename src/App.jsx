import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { initializeDemoData } from './data/demoData';
import './styles/global.css';

// Pages
import HomePage from './pages/HomePage';

// Student
import StudentLogin from './pages/student/StudentLogin';
import StudentRegister from './pages/student/StudentRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentMarks from './pages/student/StudentMarks';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentFaculty from './pages/student/StudentFaculty';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentEvents from './pages/student/StudentEvents';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentSettings from './pages/student/StudentSettings';

// Faculty
import FacultyLogin from './pages/faculty/FacultyLogin';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyProfile from './pages/faculty/FacultyProfile';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyMarks from './pages/faculty/FacultyMarks';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyComplaints from './pages/faculty/FacultyComplaints';
import FacultyEvents from './pages/faculty/FacultyEvents';
import FacultyParticipants from './pages/faculty/FacultyParticipants';
import FacultyNotifications from './pages/faculty/FacultyNotifications';
import FacultySettings from './pages/faculty/FacultySettings';

// Protected Routes
import { StudentRoute, FacultyRoute } from './components/ProtectedRoute';

const AppRoutes = () => {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Student Auth */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />

      {/* Student Protected */}
      <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
      <Route path="/student/profile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
      <Route path="/student/marks" element={<StudentRoute><StudentMarks /></StudentRoute>} />
      <Route path="/student/attendance" element={<StudentRoute><StudentAttendance /></StudentRoute>} />
      <Route path="/student/faculty" element={<StudentRoute><StudentFaculty /></StudentRoute>} />
      <Route path="/student/complaints" element={<StudentRoute><StudentComplaints /></StudentRoute>} />
      <Route path="/student/events" element={<StudentRoute><StudentEvents /></StudentRoute>} />
      <Route path="/student/notifications" element={<StudentRoute><StudentNotifications /></StudentRoute>} />
      <Route path="/student/settings" element={<StudentRoute><StudentSettings /></StudentRoute>} />

      {/* Faculty Auth */}
      <Route path="/faculty/login" element={<FacultyLogin />} />

      {/* Faculty Protected */}
      <Route path="/faculty/dashboard" element={<FacultyRoute><FacultyDashboard /></FacultyRoute>} />
      <Route path="/faculty/profile" element={<FacultyRoute><FacultyProfile /></FacultyRoute>} />
      <Route path="/faculty/students" element={<FacultyRoute><FacultyStudents /></FacultyRoute>} />
      <Route path="/faculty/marks" element={<FacultyRoute><FacultyMarks /></FacultyRoute>} />
      <Route path="/faculty/attendance" element={<FacultyRoute><FacultyAttendance /></FacultyRoute>} />
      <Route path="/faculty/complaints" element={<FacultyRoute><FacultyComplaints /></FacultyRoute>} />
      <Route path="/faculty/events" element={<FacultyRoute><FacultyEvents /></FacultyRoute>} />
      <Route path="/faculty/participants" element={<FacultyRoute><FacultyParticipants /></FacultyRoute>} />
      <Route path="/faculty/notifications" element={<FacultyRoute><FacultyNotifications /></FacultyRoute>} />
      <Route path="/faculty/settings" element={<FacultyRoute><FacultySettings /></FacultyRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProvider>
);

export default App;
