import React from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';

const FacultySettings = () => {
  const { theme, toggleTheme, session } = useApp();

  return (
    <FacultyLayout title="Settings">
      <div className="card" style={{ maxWidth: 560 }}>
        <h3 style={{ marginBottom: 20, fontSize: 17, fontWeight: 700 }}>Appearance</h3>

        <div className="flex-between" style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontWeight: 600 }}>Theme</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>Switch between light and dark mode</p>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Current Theme</p>
          <span className={`badge badge-${theme === 'light' ? 'blue' : 'gray'}`}>
            {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </span>
        </div>

        <h3 style={{ marginTop: 24, marginBottom: 16, fontSize: 17, fontWeight: 700 }}>Account Information</h3>
        <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>LOGGED IN AS</p>
          <p style={{ fontWeight: 600 }}>{session?.name}</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Faculty ID: {session?.facultyId}</p>
        </div>
        <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>ASSIGNED SUBJECT</p>
          <p style={{ fontWeight: 500 }}>{session?.subject}</p>
        </div>
        <div style={{ padding: '12px 0' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>ROLE</p>
          <span className="badge badge-green">Faculty</span>
        </div>

        <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
          ℹ️ This is a demo portal. Data is stored locally in your browser using LocalStorage.
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultySettings;
