import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getStudentAttendance } from '../../utils/storage';
import { getAttendanceStatus } from '../../data/demoData';

const StudentAttendance = () => {
  const { session } = useApp();
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (session) setAttendance(getStudentAttendance(session.regNo) || []);
  }, [session]);

  const overallPct = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + a.percentage, 0) / attendance.length)
    : 0;
  const totalClasses = attendance.reduce((s, a) => s + a.total, 0);
  const totalAttended = attendance.reduce((s, a) => s + a.attended, 0);
  const totalMissed = attendance.reduce((s, a) => s + a.missed, 0);
  const overallStatus = getAttendanceStatus(overallPct);

  const colorMap = { green: 'var(--success)', orange: 'var(--warning)', red: 'var(--danger)', darkred: '#991b1b' };
  const badgeMap = { green: 'green', orange: 'orange', red: 'red', darkred: 'red' };

  return (
    <StudentLayout title="Attendance">
      {overallPct < 65 && (
        <div className="alert alert-danger">🚨 <strong>Critical Warning!</strong> Your overall attendance is {overallPct}%. You are at risk of being detained. Please attend all remaining classes.</div>
      )}
      {overallPct >= 65 && overallPct < 75 && (
        <div className="alert alert-warning">⚠️ <strong>Low Attendance Warning!</strong> Your attendance is {overallPct}%. Minimum required is 75%. Please improve your attendance immediately.</div>
      )}

      <div className="stat-cards" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className={`stat-icon ${badgeMap[overallStatus.color]}`}>📅</div>
          <div className="stat-info"><h4>{overallPct}%</h4><p>Overall Attendance</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div className="stat-info"><h4>{totalClasses}</h4><p>Total Classes</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info"><h4>{totalAttended}</h4><p>Classes Attended</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">❌</div>
          <div className="stat-info"><h4>{totalMissed}</h4><p>Classes Missed</p></div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Overall Attendance</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="progress-bar-wrap" style={{ flex: 1, height: 14 }}>
            <div className="progress-bar" style={{
              width: `${overallPct}%`,
              background: colorMap[overallStatus.color]
            }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: colorMap[overallStatus.color] }}>{overallPct}%</span>
          <span className={`badge badge-${badgeMap[overallStatus.color]}`}>{overallStatus.label}</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Minimum Required: </span>
            <strong style={{ color: 'var(--warning)' }}>75%</strong>
          </div>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Current Status: </span>
            <strong style={{ color: colorMap[overallStatus.color] }}>{overallStatus.label}</strong>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="card">
        <div className="card-header">
          <h3>Subject-wise Attendance</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Attended</th>
                <th>Total</th>
                <th>Missed</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No attendance data.</td></tr>
              ) : (
                attendance.map((a, i) => {
                  const st = getAttendanceStatus(a.percentage);
                  return (
                    <tr key={a.subject}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{a.subject}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{a.attended}</td>
                      <td>{a.total}</td>
                      <td style={{ color: a.missed > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>{a.missed}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar-wrap" style={{ width: 70 }}>
                            <div className="progress-bar" style={{ width: `${a.percentage}%`, background: colorMap[st.color] }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: colorMap[st.color] }}>{a.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${badgeMap[st.color]}`}>{st.label}</span>
                        {a.percentage < 75 && <span style={{ marginLeft: 6, fontSize: 14 }}>⚠️</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
