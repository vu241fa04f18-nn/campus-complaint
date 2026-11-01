import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getNotificationsForRecipient, markAllNotificationsRead } from '../../utils/storage';
import NotificationPanel from './NotificationPanel';

const FacultySidebar = ({ open, onClose }) => {
  const { logout, session } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/faculty/profile', label: 'My Profile', icon: '👤' },
    { to: '/faculty/students', label: 'My Students', icon: '👥' },
    { to: '/faculty/marks', label: 'Marks Management', icon: '📊' },
    { to: '/faculty/attendance', label: 'Attendance Management', icon: '📅' },
    { to: '/faculty/complaints', label: 'Student Complaints', icon: '📝' },
    { to: '/faculty/events', label: 'College Events', icon: '🎉' },
    { to: '/faculty/participants', label: 'Event Participants', icon: '✅' },
    { to: '/faculty/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/faculty/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>CAMPUS</h2>
          <p>Faculty Portal</p>
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

const FacultyTopBar = ({ title, onHamburger }) => {
  const { theme, toggleTheme, session } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (session) {
      const notifs = getNotificationsForRecipient(session.facultyId);
      setNotifications(notifs);
    }
  }, [session, showNotif]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleBell = () => {
    setShowNotif((v) => !v);
    if (!showNotif && session) markAllNotificationsRead(session.facultyId);
  };

  const initials = session?.name
    ? session.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'FC';

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
        <div className="user-avatar" style={{ background: '#059669' }}>{initials}</div>
      </div>
      {showNotif && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotif(false)}
          onUpdate={() => {
            if (session) setNotifications(getNotificationsForRecipient(session.facultyId));
          }}
        />
      )}
    </div>
  );
};

export const FacultyLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-layout">
      <FacultySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <FacultyTopBar title={title} onHamburger={() => setSidebarOpen(true)} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};
