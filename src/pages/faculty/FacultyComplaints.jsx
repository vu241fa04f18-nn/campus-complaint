import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getComplaintsByFaculty, updateComplaint, saveStudentMarks, getStudentMarks, addNotification } from '../../utils/storage';

const STATUS_BADGE = {
  Submitted: 'gray',
  'Under Review': 'orange',
  Responded: 'blue',
  Resolved: 'green',
};

const STATUSES = ['Submitted', 'Under Review', 'Responded', 'Resolved'];

const FacultyComplaints = () => {
  const { session } = useApp();
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [marksAdjust, setMarksAdjust] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const load = () => {
    if (session) setComplaints(getComplaintsByFaculty(session.facultyId));
  };

  useEffect(() => { load(); }, [session]);

  const handleSelect = (c) => {
    setSelected(c);
    setResponse(c.response || '');
    setStatus(c.status);
    setMarksAdjust(false);
    setSavedMsg('');
  };

  const handleSave = () => {
    if (!selected) return;
    updateComplaint(selected.id, { response, status });

    // Notify student
    addNotification({
      recipientId: String(selected.regNo),
      message: `Your complaint about "${selected.subject}" has been updated. Status: ${status}. ${response ? 'Faculty has responded.' : ''}`,
      type: 'complaint',
    });

    setSavedMsg('Response saved and student notified!');
    load();
    setSelected({ ...selected, response, status });
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const filtered = complaints.filter(
    (c) => filterStatus === 'All' || c.status === filterStatus
  );

  return (
    <FacultyLayout title="Student Complaints">
      {selected ? (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>
            ← Back to Complaints
          </button>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selected.subject}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                  From: {selected.studentName} (Reg: {selected.regNo}) &nbsp;•&nbsp; {selected.branch} – {selected.section}
                </p>
              </div>
              <span className={`badge badge-${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>COMPLAINT CATEGORY</p>
              <p style={{ fontWeight: 600 }}>{selected.category}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, marginTop: 12 }}>COMPLAINT DESCRIPTION</p>
              <p style={{ fontSize: 14 }}>{selected.description}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                Submitted: {new Date(selected.submittedAt).toLocaleString('en-IN')}
              </p>
            </div>

            {savedMsg && <div className="alert alert-success">✅ {savedMsg}</div>}

            <div className="form-row" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label>Update Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Faculty Response</label>
              <textarea
                rows={4}
                placeholder="Write your response to the student..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleSave}>Save & Notify Student</button>
              {(selected.category === 'Incorrect Marks' || selected.category === 'Missing Marks') && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setMarksAdjust(!marksAdjust)}
                >
                  {marksAdjust ? 'Hide Marks Editor' : '✏️ Adjust Marks'}
                </button>
              )}
            </div>

            {marksAdjust && (
              <MarksAdjuster student={{ regNo: selected.regNo, name: selected.studentName }} onDone={() => setMarksAdjust(false)} />
            )}
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, flex: 1 }}>Assigned Complaints</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 14 }}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} complaints</span>
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No complaints found.</h3>
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="complaint-card" style={{ cursor: 'pointer' }} onClick={() => handleSelect(c)}>
                <div className="complaint-card-header">
                  <div>
                    <h4>{c.subject}</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                      {c.studentName} (Reg: {c.regNo}) &nbsp;•&nbsp; {c.section}
                    </p>
                  </div>
                  <span className={`badge badge-${STATUS_BADGE[c.status] || 'gray'}`}>{c.status}</span>
                </div>
                <p className="complaint-desc">{c.description.slice(0, 120)}{c.description.length > 120 ? '...' : ''}</p>
                <div className="complaint-meta">
                  <span>🏷️ {c.category}</span>
                  <span>📅 {new Date(c.submittedAt).toLocaleDateString('en-IN')}</span>
                  <span className="badge badge-blue" style={{ fontSize: 11 }}>Click to respond</span>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </FacultyLayout>
  );
};

// Inline Marks Adjuster component
const MarksAdjuster = ({ student, onDone }) => {
  const [marks, setMarks] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const m = getStudentMarks(student.regNo) || [];
    setMarks(m.map((x) => ({ ...x })));
  }, [student.regNo]);

  const handleChange = (i, val) => {
    const updated = [...marks];
    const n = parseInt(val, 10);
    updated[i].obtained = isNaN(n) ? 0 : Math.min(updated[i].max, Math.max(0, n));
    setMarks(updated);
    setSaved(false);
  };

  const handleSave = () => {
    saveStudentMarks(student.regNo, marks);
    addNotification({
      recipientId: String(student.regNo),
      message: `Your marks have been corrected following your complaint. Please check your marks section.`,
      type: 'marks',
    });
    setSaved(true);
  };

  return (
    <div style={{ marginTop: 20, padding: 20, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h4>Adjust Marks – {student.name}</h4>
        {saved && <span className="badge badge-green">✓ Marks updated!</span>}
        <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Marks</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Subject</th><th>Obtained</th><th>Max</th></tr></thead>
          <tbody>
            {marks.map((m, i) => (
              <tr key={m.subject}>
                <td style={{ fontSize: 12 }}>{m.subject}</td>
                <td>
                  <input type="number" min={0} max={m.max} value={m.obtained}
                    onChange={(e) => handleChange(i, e.target.value)}
                    style={{ width: 70, padding: '5px 8px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 13 }} />
                </td>
                <td>{m.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyComplaints;
