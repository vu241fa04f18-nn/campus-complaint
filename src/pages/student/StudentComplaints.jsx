import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import {
  getComplaintsByStudent, addComplaint, getStudentMarks, generateId, addNotification
} from '../../utils/storage';
import { getStudentByRegNo } from '../../utils/storage';
import { getFacultyForSubject, getSubjectsForStudent } from '../../data/demoData';

const CATEGORIES = [
  'Incorrect Marks',
  'Missing Marks',
  'Attendance Errors',
  'Subject-related Academic Issues',
  'Other Academic Issues',
];

const STATUS_BADGE = {
  Submitted: 'gray',
  'Under Review': 'orange',
  Responded: 'blue',
  Resolved: 'green',
};

const StudentComplaints = () => {
  const { session } = useApp();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', category: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subjects, setSubjects] = useState([]);

  const loadComplaints = () => {
    if (session) setComplaints(getComplaintsByStudent(session.regNo));
  };

  useEffect(() => {
    loadComplaints();
    if (session) setSubjects(getSubjectsForStudent(session.branch));
  }, [session]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.category || !form.description.trim()) {
      setError('All fields are required.');
      return;
    }

    const student = getStudentByRegNo(session.regNo);
    const fi = getFacultyForSubject(session.branch, form.subject);

    const complaint = {
      id: generateId(),
      regNo: String(session.regNo),
      studentName: student?.name || session.name,
      branch: session.branch,
      section: session.section,
      subject: form.subject,
      category: form.category,
      description: form.description.trim(),
      assignedFacultyId: fi.facultyId,
      assignedFacultyName: fi.facultyName,
      status: 'Submitted',
      response: '',
      submittedAt: new Date().toISOString(),
    };

    addComplaint(complaint);

    // Notify faculty
    addNotification({
      recipientId: fi.facultyId,
      message: `New complaint from ${student?.name || session.name} (Reg: ${session.regNo}) regarding "${form.subject}" – ${form.category}.`,
      type: 'complaint',
    });

    setSuccess('Complaint submitted successfully!');
    setForm({ subject: '', category: '', description: '' });
    setShowForm(false);
    loadComplaints();

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <StudentLayout title="Complaints">
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: 4 }}>My Complaints</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Submit and track your academic complaints here.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(''); }}>
          {showForm ? '✕ Cancel' : '+ New Complaint'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Submit New Complaint</h3>
          {error && <div className="error-msg">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">Select Subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Complaint Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {form.subject && (
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                📋 This complaint will be routed to: <strong>{getFacultyForSubject(session?.branch || 'CSE', form.subject).facultyName}</strong>
              </div>
            )}

            <div className="form-group">
              <label>Complaint Description *</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your complaint in detail..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Complaint</button>
          </form>
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No complaints submitted yet.</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Use the button above to submit a new complaint.</p>
        </div>
      ) : (
        complaints.map((c) => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-card-header">
              <div>
                <h4>{c.subject}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {c.category} &nbsp;•&nbsp; Assigned to: {c.assignedFacultyName}
                </p>
              </div>
              <span className={`badge badge-${STATUS_BADGE[c.status] || 'gray'}`}>{c.status}</span>
            </div>
            <p className="complaint-desc">{c.description}</p>
            <div className="complaint-meta">
              <span>📅 {new Date(c.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>🏷️ {c.category}</span>
            </div>
            {c.response && (
              <div className="complaint-response">
                <strong>Faculty Response ({c.assignedFacultyName}):</strong>
                <p style={{ marginTop: 6 }}>{c.response}</p>
              </div>
            )}
          </div>
        ))
      )}
    </StudentLayout>
  );
};

export default StudentComplaints;
