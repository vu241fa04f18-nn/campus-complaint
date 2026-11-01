import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getStudents, saveStudents, nextRegNo } from '../../utils/storage';
import { initializeNewStudentData, BRANCHES, SECTIONS, ACADEMIC_YEARS, SEMESTERS } from '../../data/demoData';

const StudentRegister = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', branch: '', academicYear: '',
    semester: '', section: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    const { name, email, phone, branch, academicYear, semester, section, password, confirmPassword } = form;
    if (!name || !email || !phone || !branch || !academicYear || !semester || !section || !password || !confirmPassword) {
      return 'All fields are required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (!/^\d{10}$/.test(phone)) return 'Phone number must be 10 digits.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    const emailExists = getStudents().some((s) => s.email.toLowerCase() === email.toLowerCase());
    if (emailExists) return 'An account with this email already exists.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const err = validate();
    if (err) { setError(err); setLoading(false); return; }

    const regNo = nextRegNo();
    const student = {
      regNo,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      branch: form.branch,
      academicYear: form.academicYear,
      semester: form.semester,
      section: form.section,
      password: form.password,
      classTeacher: 'Sravani Madam',
    };

    const students = getStudents();
    students.push(student);
    saveStudents(students);
    initializeNewStudentData(regNo, form.branch);

    setSuccess(`Registration successful! Your Registration Number is: ${regNo}`);

    setTimeout(() => {
      login({ role: 'student', regNo, name: student.name, branch: student.branch, section: student.section });
      navigate('/student/dashboard');
    }, 2000);
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 24 }}>
      <div className="auth-card" style={{ maxWidth: 540 }}>
        <div className="auth-card-header">
          <div className="auth-logo">C</div>
          <h2>Student Registration</h2>
          <p>Create your CAMPUS account</p>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}
        {success && <div className="success-msg">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" placeholder="name@email.com" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input name="phone" placeholder="10-digit phone number" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Branch *</label>
              <select name="branch" value={form.branch} onChange={handleChange}>
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Academic Year *</label>
              <select name="academicYear" value={form.academicYear} onChange={handleChange}>
                <option value="">Select Year</option>
                {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Semester *</label>
              <select name="semester" value={form.semester} onChange={handleChange}>
                <option value="">Select Semester</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Section *</label>
            <select name="section" value={form.section} onChange={handleChange}>
              <option value="">Select Section</option>
              {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
            ℹ️ Your Registration Number will be automatically generated upon successful registration.
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !!success}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/student/login">Login here</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 6 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
