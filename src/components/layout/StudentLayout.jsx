import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getNotificationsForRecipient, markAllNotificationsRead } from '../../utils/storage';
import NotificationPanel from './NotificationPanel';

const StudentSidebar = ({ open, onClose }) => {
  const { logout, session } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/student/profile', label: 'My Profile', icon: '👤' },
    { to: '/student/marks', label: 'Marks', icon: '📊' },
    { to: '/student/attendance', label: 'Attendance', icon: '📅' },
    { to: '/student/faculty', label: 'Faculty & TAs', icon: '👨‍🏫' },
    { to: '/student/complaints', label: 'Complaints', icon: '📝' },
    { to: '/student/events', label: 'College Events', icon: '🎉' },
    { to: '/student/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/student/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>CAMPUS</h2>
          <p>Student Portal</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button className="nav-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </nav>
        <div className="sidebar-footer" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>
          {session?.name}
        </div>
      </aside>
    </>
  );
};

const StudentTopBar = ({ title, onHamburger }) => {
  const { theme, toggleTheme, session } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (session) {
      const notifs = getNotificationsForRecipient(String(session.regNo));
      setNotifications(notifs);
    }
  }, [session, showNotif]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleBell = () => {
    setShowNotif((v) => !v);
    if (!showNotif && session) {
      markAllNotificationsRead(String(session.regNo));
    }
  };

  const initials = session?.name
    ? session.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <div className="top-bar">
      <div className="top-bar-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger" onClick={onHamburger}>
          <span /><span /><span />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="top-bar-right">
        <button className="notif-btn" onClick={handleBell}>
          🔔
          {unread > 0 && <span className="notif-count">{unread > 9 ? '9+' : unread}</span>}
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="user-avatar">{initials}</div>
      </div>
      {showNotif && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotif(false)}
          onUpdate={() => {
            if (session) setNotifications(getNotificationsForRecipient(String(session.regNo)));
          }}
        />
      )}
    </div>
  );
};

export const StudentLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-layout">
      <StudentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <StudentTopBar title={title} onHamburger={() => setSidebarOpen(true)} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};
