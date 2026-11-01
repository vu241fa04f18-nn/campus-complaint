import React, { useEffect, useState } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout';
import { useApp } from '../../context/AppContext';
import { getNotificationsForRecipient, markNotificationRead, markAllNotificationsRead } from '../../utils/storage';

const StudentNotifications = () => {
  const { session } = useApp();
  const [notifications, setNotifications] = useState([]);

  const load = () => {
    if (session) setNotifications(getNotificationsForRecipient(String(session.regNo)));
  };

  useEffect(() => { load(); }, [session]);

  const handleMarkAll = () => {
    if (session) {
      markAllNotificationsRead(String(session.regNo));
      load();
    }
  };

  const handleRead = (id) => {
    markNotificationRead(id);
    load();
  };

  const unread = notifications.filter((n) => !n.read).length;

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const iconMap = { complaint: '📝', event: '🎉', event_registration: '✅', attendance: '📅', default: '🔔' };

  return (
    <StudentLayout title="Notifications">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Notifications</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            {unread} unread notification{unread !== 1 ? 's' : ''}
          </p>
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAll}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No notifications yet.</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? 'unread' : ''}`}
              onClick={() => handleRead(n.id)}
              style={{ padding: '14px 18px' }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{iconMap[n.type] || iconMap.default}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: n.read ? 400 : 600 }}>{n.message}</p>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{formatTime(n.createdAt)}</span>
                </div>
                {!n.read && <span className="badge badge-blue" style={{ fontSize: 10, padding: '2px 8px' }}>New</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentNotifications;
