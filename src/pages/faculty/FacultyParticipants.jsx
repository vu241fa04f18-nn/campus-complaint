import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getEvents, getEventRegistrations, updateParticipation } from '../../utils/storage';

const PARTICIPATION_STATUSES = ['Registered', 'Participated', 'Not Participated'];

const FacultyParticipants = () => {
  const { session } = useApp();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    if (!session) return;
    const all = getEvents().filter((e) => e.createdByFacultyId === session.facultyId);
    setEvents(all.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [session]);

  const loadParticipants = (eventId) => {
    const regs = getEventRegistrations().filter((r) => r.eventId === eventId);
    setParticipants(regs);
  };

  const handleSelectEvent = (ev) => {
    setSelectedEvent(ev);
    loadParticipants(ev.id);
    setFilterStatus('All');
    setSaved('');
  };

  const handleStatusChange = (registrationId, newStatus) => {
    updateParticipation(registrationId, newStatus);
    loadParticipants(selectedEvent.id);
    setSaved('Participation updated!');
    setTimeout(() => setSaved(''), 2000);
  };

  const filtered = participants.filter(
    (p) => filterStatus === 'All' || p.participationStatus === filterStatus
  );

  const counts = {
    total: participants.length,
    participated: participants.filter((p) => p.participationStatus === 'Participated').length,
    notParticipated: participants.filter((p) => p.participationStatus === 'Not Participated').length,
    registered: participants.filter((p) => p.participationStatus === 'Registered').length,
  };

  return (
    <FacultyLayout title="Event Participants">
      {selectedEvent ? (
        <div>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }} onClick={() => { setSelectedEvent(null); setSaved(''); }}>
            ← Back to Events
          </button>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedEvent.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 3 }}>
                  📅 {new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} &nbsp;•&nbsp; {selectedEvent.branch} – {selectedEvent.section}
                </p>
              </div>
              {saved && <span className="badge badge-green">✓ {saved}</span>}
            </div>

            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon blue">👥</div>
                <div className="stat-info"><h4>{counts.total}</h4><p>Total Registered</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">✅</div>
                <div className="stat-info"><h4>{counts.participated}</h4><p>Participated</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon red">❌</div>
                <div className="stat-info"><h4>{counts.notParticipated}</h4><p>Not Participated</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">⏳</div>
                <div className="stat-info"><h4>{counts.registered}</h4><p>Pending Verification</p></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <h3 style={{ flex: 1 }}>Participant List</h3>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 13 }}
              >
                <option value="All">All</option>
                {PARTICIPATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Reg No.</th>
                    <th>Branch</th>
                    <th>Section</th>
                    <th>Registered On</th>
                    <th>Participation Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                        No participants found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p, i) => (
                      <tr key={p.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{p.studentName}</td>
                        <td>{p.regNo}</td>
                        <td>{p.branch}</td>
                        <td><span className="badge badge-blue">{p.section}</span></td>
                        <td style={{ fontSize: 12 }}>{new Date(p.registeredAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <span className={`badge badge-${
                            p.participationStatus === 'Participated' ? 'green' :
                            p.participationStatus === 'Not Participated' ? 'red' : 'orange'
                          }`}>
                            {p.participationStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            value={p.participationStatus}
                            onChange={(e) => handleStatusChange(p.id, e.target.value)}
                            style={{ padding: '6px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 12 }}
                          >
                            {PARTICIPATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
            Select an event to view and verify student participation.
          </p>
          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No events created yet.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Go to College Events to create one.</p>
            </div>
          ) : (
            events.map((ev) => {
              const regs = getEventRegistrations().filter((r) => r.eventId === ev.id);
              const participated = regs.filter((r) => r.participationStatus === 'Participated').length;
              return (
                <div key={ev.id} className="event-card" style={{ cursor: 'pointer' }} onClick={() => handleSelectEvent(ev)}>
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <h4>{ev.name}</h4>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="badge badge-blue">{regs.length} Registered</span>
                      <span className="badge badge-green">{participated} Participated</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{ev.description}</p>
                  <div className="event-meta">
                    <span>📅 {new Date(ev.date).toLocaleDateString('en-IN')}</span>
                    <span>🏫 {ev.branch} – {ev.section}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>View Participants</button>
                </div>
              );
            })
          )}
        </>
      )}
    </FacultyLayout>
  );
};

export default FacultyParticipants;
