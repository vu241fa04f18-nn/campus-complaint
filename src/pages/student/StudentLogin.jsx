import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getStudentByRegNo } from '../../utils/storage';

const StudentLogin = () => {
  const [form, setForm] = useState({ regNo: '', password: '' });
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

    const { regNo, password } = form;
    if (!regNo || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const student = getStudentByRegNo(regNo.trim());
    if (!student) {
      setError('Account Not Found. Please check your Registration Number.');
      setLoading(false);
      return;
    }

    if (student.password !== password) {
      setError('Incorrect password. Please try again.');
      setLoading(false);
      return;
    }

    login({
      role: 'student',
      regNo: student.regNo,
      name: student.name,
      branch: student.branch,
      section: student.section,
    });
    navigate('/student/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo">C</div>
          <h2>Student Login</h2>
          <p>Sign in to your CAMPUS student account</p>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="regNo"
              placeholder="e.g. 1011"
              value={form.regNo}
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Demo account:</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Reg No: <strong>1011</strong> &nbsp;|&nbsp; Password: <strong>Student@123</strong></p>
        </div>

        <div className="auth-footer">
          New student? <Link to="/student/register">Create Account</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 6 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
