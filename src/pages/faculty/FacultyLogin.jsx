import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getFacultyById } from '../../utils/storage';

const FacultyLogin = () => {
  const [form, setForm] = useState({ facultyId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { facultyId, password } = form;
    if (!facultyId || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const faculty = getFacultyById(facultyId.trim());
    if (!faculty) {
      setError('Account Not Found. Please check your Faculty ID.');
      setLoading(false);
      return;
    }

    if (faculty.password !== password) {
      setError('Incorrect password. Please try again.');
      setLoading(false);
      return;
    }

    login({
      role: 'faculty',
      facultyId: faculty.facultyId,
      name: faculty.name,
      subject: faculty.subject,
      branch: faculty.branch,
      sections: faculty.sections,
      taName: faculty.taName,
    });
    navigate('/faculty/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo" style={{ background: '#059669' }}>C</div>
          <h2>Faculty Login</h2>
          <p>Sign in to your CAMPUS faculty account</p>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Faculty ID</label>
            <input
              type="text"
              name="facultyId"
              placeholder="e.g. FAC101"
              value={form.facultyId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success" style={{ width: '100%', marginTop: 8, background: '#059669' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Demo accounts:</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>ID: <strong>FAC101</strong> | Password: <strong>Faculty@123</strong> (Sravani Madam)</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>ID: <strong>FAC102</strong> | Password: <strong>Faculty@123</strong> (Ramesh Sir)</p>
        </div>

        <div className="auth-footer" style={{ marginTop: 18 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;
