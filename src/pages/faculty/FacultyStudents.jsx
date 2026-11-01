import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getStudents, getStudentMarks, getStudentAttendance } from '../../utils/storage';
import { getPerformanceCategory, getAttendanceStatus } from '../../data/demoData';

const FacultyStudents = () => {
  const { session } = useApp();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedMarks, setSelectedMarks] = useState([]);
  const [selectedAtt, setSelectedAtt] = useState([]);
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
      String(s.regNo).includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === 'All' || s.section === filterSection;
    return matchSearch && matchSection;
  });

  const handleView = (s) => {
    setSelected(s);
    setSelectedMarks(getStudentMarks(s.regNo) || []);
    setSelectedAtt(getStudentAttendance(s.regNo) || []);
  };

  const avgMarks = (marks) =>
    marks.length ? Math.round(marks.reduce((sum, m) => sum + m.obtained, 0) / marks.length) : 0;
  const avgAtt = (att) =>
    att.length ? Math.round(att.reduce((sum, a) => sum + a.percentage, 0) / att.length) : 0;

  return (
    <FacultyLayout title="My Students">
      {selected ? (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => setSelected(null)}>
            ← Back to Students
          </button>

          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                {selected.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Reg: {selected.regNo} • {selected.branch} • {selected.section}</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                <div className="stat-card" style={{ padding: '10px 16px' }}>
                  <div className="stat-info"><h4>{avgMarks(selectedMarks)}%</h4><p>Marks Avg</p></div>
                </div>
                <div className="stat-card" style={{ padding: '10px 16px' }}>
                  <div className="stat-info"><h4>{avgAtt(selectedAtt)}%</h4><p>Attendance</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 14 }}>📊 Marks</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Subject</th><th>Obtained</th><th>Max</th><th>%</th></tr></thead>
                  <tbody>
                    {selectedMarks.map((m) => (
                      <tr key={m.subject}>
                        <td style={{ fontSize: 12 }}>{m.subject}</td>
                        <td>{m.obtained}</td>
                        <td>{m.max}</td>
                        <td>
                          <span className={`badge badge-${m.obtained >= 75 ? 'green' : m.obtained >= 50 ? 'orange' : 'red'}`}>
                            {Math.round((m.obtained / m.max) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 14 }}>📅 Attendance</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Subject</th><th>Attended</th><th>Total</th><th>%</th></tr></thead>
                  <tbody>
                    {selectedAtt.map((a) => {
                      const st = getAttendanceStatus(a.percentage);
                      return (
                        <tr key={a.subject}>
                          <td style={{ fontSize: 12 }}>{a.subject}</td>
                          <td>{a.attended}</td>
                          <td>{a.total}</td>
                          <td>
                            <span className={`badge badge-${st.color === 'green' ? 'green' : st.color === 'orange' ? 'orange' : 'red'}`}>
                              {a.percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ flex: 1, margin: 0, minWidth: 200 }}>
              <input
                placeholder="Search by name or registration number..."
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
                    <th>Branch</th>
                    <th>Section</th>
                    <th>Marks Avg</th>
                    <th>Attendance</th>
                    <th>Performance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No students found.</td></tr>
                  ) : (
                    filtered.map((s, i) => {
                      const marks = getStudentMarks(s.regNo) || [];
                      const att = getStudentAttendance(s.regNo) || [];
                      const mAvg = avgMarks(marks);
                      const aAvg = avgAtt(att);
                      const perf = getPerformanceCategory(mAvg);
                      const perfBadge = { 'Top Performer': 'green', 'Good Performance': 'blue', 'Average Performance': 'orange', 'Needs Improvement': 'red' };

                      return (
                        <tr key={s.regNo}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td>{s.regNo}</td>
                          <td>{s.branch}</td>
                          <td><span className="badge badge-blue">{s.section}</span></td>
                          <td>
                            <span className={`badge badge-${mAvg >= 75 ? 'green' : mAvg >= 55 ? 'orange' : 'red'}`}>{mAvg}%</span>
                          </td>
                          <td>
                            <span className={`badge badge-${aAvg >= 75 ? 'green' : aAvg >= 65 ? 'orange' : 'red'}`}>{aAvg}%</span>
                          </td>
                          <td>
                            <span className={`badge badge-${perfBadge[perf]}`} style={{ fontSize: 11 }}>{perf}</span>
                          </td>
                          <td>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleView(s)}>View</button>
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

export default FacultyStudents;
