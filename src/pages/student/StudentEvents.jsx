import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getEvents, getRegistrationsByStudent, registerForEvent, addNotification } from '../../utils/storage';

const StudentEvents = () => {
  const { session } = useApp();
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    if (!session) return;
    const all = getEvents();
    const filtered = all.filter(
      (e) =>
        (e.branch === session.branch || e.branch === 'All') &&
        (e.section === session.section || e.section === 'All')
    );
    setEvents(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setMyRegs(getRegistrationsByStudent(String(session.regNo)));
  };

  useEffect(() => { load(); }, [session]);

  const isRegistered = (eventId) => myRegs.some((r) => r.eventId === eventId);
  const getRegStatus = (eventId) => myRegs.find((r) => r.eventId === eventId)?.participationStatus || '';

  const handleRegister = (ev) => {
    const ok = registerForEvent(String(session.regNo), ev.id, session.name, session.branch, session.section);
    if (ok) {
      // Notify faculty who created the event
      addNotification({
        recipientId: ev.createdByFacultyId,
        message: `${session.name} (Reg: ${session.regNo}) has registered for event: "${ev.name}".`,
        type: 'event_registration',
      });
      setMessage(`Successfully registered for "${ev.name}"!`);
      load();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date(e.date) >= today);
  const past = events.filter((e) => new Date(e.date) < today);

  const renderEvent = (ev) => {
    const registered = isRegistered(ev.id);
    const status = getRegStatus(ev.id);
    const isPast = new Date(ev.date) < today;

    return (
      <div key={ev.id} className="event-card">
        <div className="flex-between" style={{ marginBottom: 8 }}>
          <h4>{ev.name}</h4>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {registered && (
              <span className={`badge badge-${status === 'Participated' ? 'green' : status === 'Not Participated' ? 'red' : 'blue'}`}>
                {status}
              </span>
            )}
          </div>
        </div>
        <p>{ev.description}</p>
        <div className="event-meta">
          <span>📅 {new Date(ev.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span>🏫 {ev.branch} – {ev.section}</span>
          <span>👨‍🏫 By {ev.createdByFacultyName}</span>
        </div>
        {!isPast && !registered && (
          <button className="btn btn-primary btn-sm" onClick={() => handleRegister(ev)}>
            Register for Event
          </button>
        )}
        {registered && <button className="btn btn-secondary btn-sm" disabled>✓ Registered</button>}
        {isPast && !registered && <span className="badge badge-gray">Event Ended</span>}
      </div>
    );
  };

  return (
    <StudentLayout title="College Events">
      {message && <div className="alert alert-success">✅ {message}</div>}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No events for your class yet.</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Check back later for upcoming events.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="section-title">Upcoming Events</h2>
          {upcoming.map(renderEvent)}
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 className="section-title" style={{ marginTop: 28 }}>Past Events</h2>
          {past.map(renderEvent)}
        </>
      )}
    </StudentLayout>
  );
};

export default StudentEvents;
