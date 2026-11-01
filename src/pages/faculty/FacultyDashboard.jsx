import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getStudents, getComplaintsByFaculty, getEvents } from '../../utils/storage';
import { getFacultyById } from '../../utils/storage';

const FacultyDashboard = () => {
  const { session } = useApp();
  const [faculty, setFaculty] = useState(null);
  const [myStudents, setMyStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (!session) return;
    const f = getFacultyById(session.facultyId);
    setFaculty(f);

    const sections = session.sections || [];
    const all = getStudents();
    const mine = all.filter(
      (s) => s.branch === session.branch && sections.includes(s.section)
    );
    setMyStudents(mine);

    const comps = getComplaintsByFaculty(session.facultyId);
    setComplaints(comps);

    const today = new Date(); today.setHours(0,0,0,0);
    const evts = getEvents().filter(
      (e) => e.createdByFacultyId === session.facultyId && new Date(e.date) >= today
    );
    setUpcomingEvents(evts.slice(0, 3));
  }, [session]);

  if (!faculty) return null;

  const pendingComplaints = complaints.filter((c) => c.status !== 'Resolved').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <FacultyLayout title="Dashboard">
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#059669', fontSize: 20, width: 46, height: 46, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>👨‍🏫</div>
          <div className="stat-info">
            <h4 style={{ fontSize: 14 }}>{faculty.name}</h4>
            <p>Faculty ID: {faculty.facultyId}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📚</div>
          <div className="stat-info">
            <h4 style={{ fontSize: 14 }}>{faculty.subject}</h4>
            <p>Assigned Subject</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏫</div>
          <div className="stat-info">
            <h4>{faculty.branch}</h4>
            <p>{(faculty.sections || []).join(', ')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">👥</div>
          <div className="stat-info">
            <h4>{myStudents.length}</h4>
            <p>Total Students</p>
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
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h4>{resolvedComplaints}</h4>
            <p>Resolved Complaints</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">👤</div>
          <div className="stat-info">
            <h4>{faculty.taName}</h4>
            <p>Assigned TA</p>
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
        {/* Sections Overview */}
        <div className="card">
          <div className="card-header">
            <h3>📋 My Sections</h3>
          </div>
          {(faculty.sections || []).map((sec) => {
            const secStudents = myStudents.filter((s) => s.section === sec);
            return (
              <div key={sec} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{sec}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{faculty.branch}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-blue">{secStudents.length} Students</span>
                  {faculty.classTeacher === sec && (
                    <span className="badge badge-green" style={{ marginLeft: 6 }}>Class Teacher</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <div className="card-header">
            <h3>📝 Recent Complaints</h3>
          </div>
          {complaints.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No complaints assigned.</p>
          ) : (
            complaints.slice(0, 4).map((c) => (
              <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex-between">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.studentName}</span>
                  <span className={`badge badge-${c.status === 'Resolved' ? 'green' : c.status === 'Responded' ? 'blue' : c.status === 'Under Review' ? 'orange' : 'gray'}`}>
                    {c.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{c.subject} – {c.category}</p>
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
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No upcoming events created.</p>
          ) : (
            upcomingEvents.map((ev) => (
              <div key={ev.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex-between">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{ev.name}</span>
                  <span className="badge badge-blue">{new Date(ev.date).toLocaleDateString('en-IN')}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{ev.branch} – {ev.section}</p>
              </div>
            ))
          )}
        </div>

        {/* Student Summary */}
        <div className="card">
          <div className="card-header">
            <h3>👥 Student Summary</h3>
          </div>
          {(faculty.sections || []).map((sec) => {
            const count = myStudents.filter((s) => s.section === sec).length;
            return (
              <div key={sec} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  {sec.replace('Sec ', '')}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{sec}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} students enrolled</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultyDashboard;
