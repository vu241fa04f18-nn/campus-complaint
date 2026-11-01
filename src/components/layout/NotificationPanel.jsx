import React from 'react';
import { markNotificationRead } from '../../utils/storage';

const NotificationPanel = ({ notifications, onClose, onUpdate }) => {
  const handleRead = (id) => {
    markNotificationRead(id);
    onUpdate();
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notif-panel">
      <div className="notif-panel-header">
        <h4>Notifications</h4>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>✕</button>
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? 'unread' : ''}`}
              onClick={() => handleRead(n.id)}
            >
              <p>{n.message}</p>
              <span>{formatTime(n.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
