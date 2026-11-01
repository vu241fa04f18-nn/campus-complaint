import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getStudentMarks } from '../../utils/storage';
import { getPerformanceCategory, getFacultyForSubject } from '../../data/demoData';

const StudentMarks = () => {
  const { session } = useApp();
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    if (session) setMarks(getStudentMarks(session.regNo) || []);
  }, [session]);

  const avg = marks.length ? Math.round(marks.reduce((s, m) => s + m.obtained, 0) / marks.length) : 0;
  const total = marks.reduce((s, m) => s + m.obtained, 0);
  const maxTotal = marks.reduce((s, m) => s + m.max, 0);
  const performance = getPerformanceCategory(avg);
  const perfBadge = { 'Top Performer': 'green', 'Good Performance': 'blue', 'Average Performance': 'orange', 'Needs Improvement': 'red' };

  const getGrade = (pct) => {
    if (pct >= 90) return 'O';
    if (pct >= 80) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 60) return 'B+';
    if (pct >= 50) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  };

  return (
    <StudentLayout title="Marks">
      <div className="stat-cards" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className={`stat-icon ${avg >= 75 ? 'green' : avg >= 55 ? 'orange' : 'red'}`}>📊</div>
          <div className="stat-info"><h4>{avg}%</h4><p>Average Percentage</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🔢</div>
          <div className="stat-info"><h4>{total}/{maxTotal}</h4><p>Total Marks</p></div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${perfBadge[performance] || 'blue'}`}>🏆</div>
          <div className="stat-info"><h4 style={{ fontSize: 14 }}>{performance}</h4><p>Performance</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div className="stat-info"><h4>{marks.length}</h4><p>Subjects</p></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Subject-wise Marks</h3>
          <span className={`badge badge-${perfBadge[performance]}`}>{performance}</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>TA</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No marks data available.</td></tr>
              ) : (
                marks.map((m, i) => {
                  const pct = Math.round((m.obtained / m.max) * 100);
                  const grade = getGrade(pct);
                  const fi = getFacultyForSubject(session?.branch || 'CSE', m.subject);
                  return (
                    <tr key={m.subject}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{m.subject}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{fi.facultyName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{fi.taName}</td>
                      <td><strong>{m.obtained}</strong>/{m.max}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar-wrap" style={{ width: 60 }}>
                            <div className="progress-bar" style={{
                              width: `${pct}%`,
                              background: pct >= 75 ? 'var(--success)' : pct >= 55 ? 'var(--warning)' : 'var(--danger)'
                            }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </td>
                      <td><span className={`badge badge-${pct >= 75 ? 'green' : pct >= 55 ? 'orange' : 'red'}`}>{grade}</span></td>
                      <td>
                        <span className={`badge badge-${pct >= 50 ? 'green' : 'red'}`}>
                          {pct >= 50 ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {marks.length > 0 && (
              <tfoot>
                <tr style={{ background: 'var(--bg)' }}>
                  <td colSpan={4} style={{ fontWeight: 700, padding: '11px 14px' }}>Total / Average</td>
                  <td style={{ fontWeight: 700 }}>{total}/{maxTotal}</td>
                  <td style={{ fontWeight: 700 }}>{avg}%</td>
                  <td colSpan={2}><span className={`badge badge-${perfBadge[performance]}`}>{performance}</span></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentMarks;
