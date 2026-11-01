import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getStudents, getStudentAttendance, saveStudentAttendance, addNotification } from '../../utils/storage';
import { getAttendanceStatus } from '../../data/demoData';

const FacultyAttendance = () => {
  const { session } = useApp();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editAtt, setEditAtt] = useState([]);
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
    const att = getStudentAttendance(s.regNo) || [];
    setEditAtt(att.map((a) => ({ ...a })));
    setSaved(false);
  };

  const handleChange = (idx, field, val) => {
    const updated = [...editAtt];
    const num = parseInt(val, 10);
    if (field === 'attended') {
      updated[idx].attended = isNaN(num) ? 0 : Math.min(updated[idx].total, Math.max(0, num));
      updated[idx].missed = updated[idx].total - updated[idx].attended;
      updated[idx].percentage = Math.round((updated[idx].attended / updated[idx].total) * 100);
    } else if (field === 'total') {
      updated[idx].total = isNaN(num) ? 1 : Math.max(1, num);
      updated[idx].attended = Math.min(updated[idx].attended, updated[idx].total);
      updated[idx].missed = updated[idx].total - updated[idx].attended;
      updated[idx].percentage = Math.round((updated[idx].attended / updated[idx].total) * 100);
    }
    setEditAtt(updated);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    saveStudentAttendance(selected.regNo, editAtt);
    setSaved(true);

    const overallPct = editAtt.length
      ? Math.round(editAtt.reduce((s, a) => s + a.percentage, 0) / editAtt.length)
      : 0;

    // Notify student if attendance is low
    if (overallPct < 75) {
      addNotification({
        recipientId: String(selected.regNo),
        message: `Your attendance has been updated. Current overall: ${overallPct}%. ${overallPct < 65 ? '🚨 Critical Warning!' : '⚠️ Below 75% threshold.'}`,
        type: 'attendance',
      });
    } else {
      addNotification({
        recipientId: String(selected.regNo),
        message: `Your attendance has been updated by ${session.name}. Current overall: ${overallPct}%.`,
        type: 'attendance',
      });
    }

    setTimeout(() => setSaved(false), 3000);
  };

  const colorMap = { green: 'var(--success)', orange: 'var(--warning)', red: 'var(--danger)', darkred: '#991b1b' };
  const badgeMap = { green: 'green', orange: 'orange', red: 'red', darkred: 'red' };

  return (
    <FacultyLayout title="Attendance Management">
      {selected ? (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>
            ← Back to Students
          </button>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Attendance – {selected.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 3 }}>
                  Reg No: {selected.regNo} &nbsp;•&nbsp; {selected.branch} &nbsp;•&nbsp; {selected.section}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {saved && <span className="badge badge-green">✓ Saved! Student notified.</span>}
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>

            {editAtt.length > 0 && (() => {
              const overall = Math.round(editAtt.reduce((s, a) => s + a.percentage, 0) / editAtt.length);
              const st = getAttendanceStatus(overall);
              return (
                <div className={`alert alert-${st.color === 'green' ? 'success' : st.color === 'orange' ? 'warning' : 'danger'}`} style={{ marginBottom: 16 }}>
                  Current Overall Attendance: <strong>{overall}%</strong> — {st.label}
                </div>
              );
            })()}

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
              ✏️ Edit attendance below. <strong>Attended</strong> and <strong>Total</strong> classes are editable. Percentage updates automatically.
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Total Classes</th>
                    <th>Attended</th>
                    <th>Missed</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {editAtt.map((a, i) => {
                    const st = getAttendanceStatus(a.percentage);
                    return (
                      <tr key={a.subject}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ fontWeight: 500, fontSize: 13 }}>{a.subject}</td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            value={a.total}
                            onChange={(e) => handleChange(i, 'total', e.target.value)}
                            style={{ width: 70, padding: '5px 8px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 13 }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={a.total}
                            value={a.attended}
                            onChange={(e) => handleChange(i, 'attended', e.target.value)}
                            style={{ width: 70, padding: '5px 8px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 13 }}
                          />
                        </td>
                        <td style={{ color: a.missed > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>{a.missed}</td>
                        <td>
                          <strong style={{ color: colorMap[st.color] }}>{a.percentage}%</strong>
                        </td>
                        <td>
                          <span className={`badge badge-${badgeMap[st.color]}`}>{st.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
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
                    <th>Overall Attendance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No students found.</td></tr>
                  ) : (
                    filtered.map((s, i) => {
                      const att = getStudentAttendance(s.regNo) || [];
                      const avg = att.length ? Math.round(att.reduce((sum, a) => sum + a.percentage, 0) / att.length) : 0;
                      const st = getAttendanceStatus(avg);
                      return (
                        <tr key={s.regNo}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td>{s.regNo}</td>
                          <td><span className="badge badge-blue">{s.section}</span></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="progress-bar-wrap" style={{ width: 60 }}>
                                <div className="progress-bar" style={{ width: `${avg}%`, background: colorMap[st.color] }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: colorMap[st.color] }}>{avg}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge badge-${badgeMap[st.color]}`}>{st.label}</span>
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSelect(s)}>Edit</button>
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

export default FacultyAttendance;
