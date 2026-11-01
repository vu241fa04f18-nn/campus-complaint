import React, { useEffect, useState } from 'react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { useApp } from '../../context/AppContext';
import { getEvents, addEvent, getRegistrationsByEvent, addNotification, getStudents, generateId } from '../../utils/storage';
import { SECTIONS } from '../../data/demoData';

const FacultyEvents = () => {
  const { session } = useApp();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', date: '', section: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    if (session) {
      const all = getEvents();
      const mine = all.filter((e) => e.createdByFacultyId === session.facultyId);
      setEvents(mine.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

  useEffect(() => { load(); }, [session]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.date || !form.section) {
      setError('All fields are required.');
      return;
    }

    const event = {
      id: generateId(),
      name: form.name.trim(),
      description: form.description.trim(),
      date: form.date,
      branch: session.branch,
      section: form.section,
      createdByFacultyId: session.facultyId,
      createdByFacultyName: session.name,
      createdAt: new Date().toISOString(),
    };

    addEvent(event);

    // Notify all students in that section
    const allStudents = getStudents();
    const sectionStudents = allStudents.filter(
      (s) => s.branch === session.branch && s.section === form.section
    );
    sectionStudents.forEach((s) => {
      addNotification({
        recipientId: String(s.regNo),
        message: `New event "${form.name}" on ${new Date(form.date).toLocaleDateString('en-IN')} has been published for your class.`,
        type: 'event',
      });
    });

    setSuccess(`Event "${form.name}" created and students notified!`);
    setForm({ name: '', description: '', date: '', section: '' });
    setShowForm(false);
    load();
    setTimeout(() => setSuccess(''), 4000);
  };

  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <FacultyLayout title="College Events">
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: 4 }}>My Events</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Create and manage events for your assigned classes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(''); }}>
          {showForm ? '✕ Cancel' : '+ Create Event'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Create New Event</h3>
          {error && <div className="error-msg">⚠️ {error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>Event Name *</label>
                <input name="name" placeholder="e.g. Code-a-Thon 2024" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Event Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="form-group">
              <label>Section *</label>
              <select name="section" value={form.section} onChange={handleChange}>
                <option value="">Select Section</option>
                <option value="All">All Sections</option>
                {(session?.sections || []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Event Description *</label>
              <textarea name="description" rows={3} placeholder="Describe the event..." value={form.description} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">Publish Event</button>
            </div>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No events created yet.</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Use the button above to create your first event.</p>
        </div>
      ) : (
        events.map((ev) => {
          const regs = getRegistrationsByEvent(ev.id);
          const isPast = new Date(ev.date) < today;
          return (
            <div key={ev.id} className="event-card">
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <h4>{ev.name}</h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge badge-${isPast ? 'gray' : 'blue'}`}>{isPast ? 'Ended' : 'Upcoming'}</span>
                  <span className="badge badge-green">{regs.length} Registered</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{ev.description}</p>
              <div className="event-meta">
                <span>📅 {new Date(ev.date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span>🏫 {ev.branch} – {ev.section}</span>
              </div>
            </div>
          );
        })
      )}
    </FacultyLayout>
  );
};

export default FacultyEvents;
