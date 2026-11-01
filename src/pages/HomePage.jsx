import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-header-brand">
          <h1>CAMPUS</h1>
          <span>College Complaint Management Portal</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="home-hero">
        <h2>CAMPUS</h2>
        <h3>College Complaint Management Portal</h3>
        <p>
          A centralized platform for students to manage academic records, submit complaints, 
          track attendance and marks, and engage with college events — all in one place.
        </p>

        <div className="login-cards">
          <div className="login-card">
            <div className="login-card-icon student">🎓</div>
            <h3>Student Login</h3>
            <p>Access your dashboard, marks, attendance and submit complaints.</p>
            <Link to="/student/login" className="btn btn-primary" style={{ width: '100%' }}>
              Student Login
            </Link>
          </div>

          <div className="login-card">
            <div className="login-card-icon faculty">👨‍🏫</div>
            <h3>Faculty Login</h3>
            <p>Manage students, update marks, attendance and review complaints.</p>
            <Link to="/faculty/login" className="btn btn-success" style={{ width: '100%', background: '#059669' }}>
              Faculty Login
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '📊', label: 'Academic Records' },
            { icon: '📝', label: 'Complaint System' },
            { icon: '📅', label: 'Attendance Tracking' },
            { icon: '🎉', label: 'Events & Activities' },
          ].map((f) => (
            <div key={f.label} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{f.label}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="home-footer">
        © 2024 CAMPUS – College Complaint Management Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
