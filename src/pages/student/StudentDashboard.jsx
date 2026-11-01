import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getStudentByRegNo, getStudentMarks, getStudentAttendance, getComplaintsByStudent, getEvents, getRegistrationsByStudent } from '../../utils/storage';
import { getPerformanceCategory, getAttendanceStatus } from '../../data/demoData';

const StudentDashboard = () => {
  const { session } = useApp();
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (!session) return;
    const s = getStudentByRegNo(session.regNo);
    setStudent(s);
    setMarks(getStudentMarks(session.regNo) || []);
    setAttendance(getStudentAttendance(session.regNo) || []);
    setComplaints(getComplaintsByStudent(session.regNo));

    const today = new Date();
    const evts = getEvents().filter(
      (e) => (e.branch === session.branch || e.branch === 'All') &&
        (e.section === session.section || e.section === 'All') &&
        new Date(e.date) >= today
    );
    setUpcomingEvents(evts.slice(0, 3));
  }, [session]);

  if (!student) return null;

  const avgMarks = marks.length ? Math.round(marks.reduce((s, m) => s + m.obtained, 0) / marks.length) : 0;
  const avgAtt = attendance.length ? Math.round(attendance.reduce((s, a) => s + a.percentage, 0) / attendance.length) : 0;
  const performance = getPerformanceCategory(avgMarks);
  const attStatus = getAttendanceStatus(avgAtt);
  const pendingComplaints = complaints.filter((c) => c.status !== 'Resolved').length;

  const perfColor = { 'Top Performer': 'green', 'Good Performance': 'blue', 'Average Performance': 'orange', 'Needs Improvement': 'red' };
  const attColor = { green: 'green', orange: 'orange', red: 'red', darkred: 'red' };

  return (
    <StudentLayout title="Dashboard">
      {avgAtt < 65 && (
        <div className="alert alert-danger">🚨 <strong>Critical Attendance Warning!</strong> Your overall attendance is {avgAtt}% — below 65%. Immediate action required.</div>
      )}
      {avgAtt >= 65 && avgAtt < 75 && (
        <div className="alert alert-warning">⚠️ <strong>Low Attendance Warning!</strong> Your overall attendance is {avgAtt}% — below 75%. Please attend classes regularly.</div>
      )}

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon blue">🎓</div>
          <div className="stat-info">
            <h4>{student.name.split(' ')[0]}</h4>
            <p>Welcome back!</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🆔</div>
          <div className="stat-info">
            <h4>{student.regNo}</h4>
            <p>Registration No.</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div className="stat-info">
            <h4>{student.branch}</h4>
            <p>{student.section}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${avgMarks >= 75 ? 'green' : avgMarks >= 55 ? 'orange' : 'red'}`}>📊</div>
          <div className="stat-info">
            <h4>{avgMarks}%</h4>
            <p>Overall Marks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${attColor[attStatus.color] || 'orange'}`}>📅</div>
          <div className="stat-info">
            <h4>{avgAtt}%</h4>
            <p>Overall Attendance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${perfColor[performance] || 'blue'}`}>🏆</div>
          <div className="stat-info">
            <h4 style={{ fontSize: 14 }}>{performance}</h4>
            <p>Performance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className={`stat-icon ${pendingComplaints > 0 ? 'orange' : 'green'}`}>📝</div>
          <div className="stat-info">
            <h4>{pendingComplaints}</h4>
            <p>Pending Complaints</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">🎉</div>
          <div className="stat-info">
            <h4>{upcomingEvents.length}</h4>
            <p>Upcoming Events</p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Subject Marks Overview */}
        <div className="card">
          <div className="card-header">
            <h3>📊 Subject Marks Overview</h3>
            <span className={`badge badge-${perfColor[performance] || 'blue'}`}>{performance}</span>
          </div>
          {marks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No marks data available yet.</p>
          ) : (
            marks.map((m) => (
              <div key={m.subject} style={{ marginBottom: 10 }}>
                <div className="flex-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{m.subject}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.obtained}/{m.max}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{
                    width: `${(m.obtained / m.max) * 100}%`,
                    background: m.obtained >= 75 ? 'var(--success)' : m.obtained >= 55 ? 'var(--warning)' : 'var(--danger)'
                  }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Attendance Overview */}
        <div className="card">
          <div className="card-header">
            <h3>📅 Attendance Overview</h3>
            <span className={`badge badge-${attColor[attStatus.color] || 'orange'}`}>{attStatus.label}</span>
          </div>
          {attendance.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No attendance data available yet.</p>
          ) : (
            attendance.map((a) => {
              const st = getAttendanceStatus(a.percentage);
              const col = { green: 'var(--success)', orange: 'var(--warning)', red: 'var(--danger)', darkred: '#991b1b' };
              return (
                <div key={a.subject} style={{ marginBottom: 10 }}>
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{a.subject}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: col[st.color] }}>{a.percentage}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" style={{ width: `${a.percentage}%`, background: col[st.color] }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <div className="card-header">
            <h3>📝 Recent Complaints</h3>
          </div>
          {complaints.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No complaints submitted yet.</p>
          ) : (
            complaints.slice(0, 3).map((c) => (
              <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex-between">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.subject}</span>
                  <span className={`badge badge-${c.status === 'Resolved' ? 'green' : c.status === 'Responded' ? 'blue' : c.status === 'Under Review' ? 'orange' : 'gray'}`}>
                    {c.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{c.category}</p>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h3>🎉 Upcoming Events</h3>
          </div>
          {upcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No upcoming events for your class.</p>
          ) : (
            upcomingEvents.map((ev) => (
              <div key={ev.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex-between">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{ev.name}</span>
                  <span className="badge badge-blue">{new Date(ev.date).toLocaleDateString('en-IN')}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{ev.description?.slice(0, 60)}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
