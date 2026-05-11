import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Check, Folder } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Topbar.css';

const Topbar = () => {
  const { notifications, markNotificationsRead } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    markNotificationsRead();
    setShowNotifications(false);
  };

  return (
    <header className="topbar">
      <div className="search-container" ref={searchRef} style={{ position: 'relative', padding: 0, background: 'transparent', border: 'none', width: '350px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 16px', transition: 'all 0.2s ease' }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search projects, tasks, or members..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>

        {isSearching && searchQuery.length > 0 && (
          <div className="notification-dropdown glass-panel animate-scale-in" style={{ top: '45px', left: 0, right: 'auto', width: '100%' }}>
            <div className="notification-list" style={{ maxHeight: '250px' }}>
              <div className="notification-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <Folder size={16} color="var(--accent-color)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem' }}>Search entire workspace for <strong>"{searchQuery}"</strong></span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Press Enter to search</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <div className="notification-wrapper" ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="notification-btn btn-ghost"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown glass-panel animate-scale-in">
              <div className="notification-header">
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="mark-read-btn btn-ghost">
                    <Check size={14} /> Mark read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 && (
                  <div className="notification-empty">No notifications yet</div>
                )}
                {notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                    <div className="notif-content">
                      <div className="notif-dot" style={{ opacity: notif.read ? 0 : 1 }}></div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{notif.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
