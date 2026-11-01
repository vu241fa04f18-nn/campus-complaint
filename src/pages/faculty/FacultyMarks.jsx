import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getStudents, getStudentMarks, saveStudentMarks, addNotification } from '../../utils/storage';

const FacultyMarks = () => {
  const { session } = useApp();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editMarks, setEditMarks] = useState([]);
  const [saved, setSaved] = useState(false);
  const [filterSection, setFilterSection] = useState('All');

  useEffect(() => {
    if (!session) return;
    const all = getStudents();
    const mine = all.filter(
      (s) => s.branch === session.branch && (session.sections || []).includes(s.section)
    );
    setStudents(mine);
  }, [session]);

  const sections = session?.sections || [];

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      String(s.regNo).includes(search.trim()) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === 'All' || s.section === filterSection;
    return matchSearch && matchSection;
  });

  const handleSelect = (s) => {
    setSelected(s);
    const marks = getStudentMarks(s.regNo) || [];
    setEditMarks(marks.map((m) => ({ ...m })));
    setSaved(false);
  };

  const handleMarkChange = (idx, val) => {
    const updated = [...editMarks];
    const num = parseInt(val, 10);
    updated[idx].obtained = isNaN(num) ? 0 : Math.min(updated[idx].max, Math.max(0, num));
    setEditMarks(updated);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    saveStudentMarks(selected.regNo, editMarks);
    setSaved(true);
    // Notify student
    addNotification({
      recipientId: String(selected.regNo),
      message: `Your marks have been updated by ${session.name}. Check your Marks section for details.`,
      type: 'marks',
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <FacultyLayout title="Marks Management">
      {selected ? (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>
            ← Back to Students
          </button>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Marks – {selected.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 3 }}>
                  Reg No: {selected.regNo} &nbsp;•&nbsp; {selected.branch} &nbsp;•&nbsp; {selected.section}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {saved && <span className="badge badge-green">✓ Saved successfully!</span>}
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
              ✏️ Edit the marks below. Changes will immediately reflect in the student's dashboard after saving.
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Max Marks</th>
                    <th>Marks Obtained</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {editMarks.map((m, i) => (
                    <tr key={m.subject}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{m.subject}</td>
                      <td>{m.max}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={m.max}
                          value={m.obtained}
                          onChange={(e) => handleMarkChange(i, e.target.value)}
                          style={{
                            width: 80,
                            padding: '6px 10px',
                            border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            fontSize: 14,
                          }}
                        />
                      </td>
                      <td>
                        <span className={`badge badge-${m.obtained >= 75 ? 'green' : m.obtained >= 50 ? 'orange' : 'red'}`}>
                          {Math.round((m.obtained / m.max) * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg)' }}>
                    <td colSpan={3} style={{ fontWeight: 700, padding: '11px 14px' }}>Average</td>
                    <td style={{ fontWeight: 700 }}>
                      {editMarks.length ? Math.round(editMarks.reduce((s, m) => s + m.obtained, 0) / editMarks.length) : 0} / 100
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {editMarks.length ? Math.round(editMarks.reduce((s, m) => s + m.obtained, 0) / editMarks.length) : 0}%
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ flex: 1, margin: 0, minWidth: 200 }}>
              <input
                placeholder="Search student by name or registration number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 14 }}
            >
              <option value="All">All Sections</option>
              {sections.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} students</span>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Reg No.</th>
                    <th>Section</th>
                    <th>Avg Marks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No students found.</td></tr>
                  ) : (
                    filtered.map((s, i) => {
                      const marks = getStudentMarks(s.regNo) || [];
                      const avg = marks.length ? Math.round(marks.reduce((sum, m) => sum + m.obtained, 0) / marks.length) : 0;
                      return (
                        <tr key={s.regNo}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td>{s.regNo}</td>
                          <td><span className="badge badge-blue">{s.section}</span></td>
                          <td>
                            <span className={`badge badge-${avg >= 75 ? 'green' : avg >= 55 ? 'orange' : 'red'}`}>{avg}%</span>
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSelect(s)}>Edit Marks</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </FacultyLayout>
  );
};

export default FacultyMarks;
