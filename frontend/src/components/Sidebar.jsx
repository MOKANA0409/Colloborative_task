import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, LogOut, Code, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import TeamModal from './Modals/TeamModal';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { channels, teamMembers } = useAppContext();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <Code className="logo-icon" size={28} />
            <span className="logo-text">Nexus</span>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <span className="nav-label">Main</span>
          <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/project/1" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare size={20} />
            <span>Active Project</span>
          </NavLink>

          <div style={{marginTop: '20px', marginBottom: '8px'}}>
            <span className="nav-label">Channels</span>
          </div>
          {channels.map(ch => (
            <NavLink key={ch.id} to={`/project/1?channel=${ch.id}`} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <Hash size={18} />
              <span>{ch.name}</span>
              {ch.unread > 0 && <span style={{marginLeft: 'auto', background: 'var(--accent-color)', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'}}>{ch.unread}</span>}
            </NavLink>
          ))}

          <NavLink to="/messages" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Messages</span>
          </NavLink>
          
          <div style={{marginTop: '20px', marginBottom: '8px'}}>
            <span className="nav-label">Direct Messages</span>
          </div>
          {teamMembers.map(m => {
            if (m.id === user?.id) return null; // Don't DM yourself
            return (
              <NavLink key={`dm-${m.id}`} to={`/project/1?dm=${m.id}`} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <div style={{width: 10, height: 10, borderRadius: '50%', background: m.status === 'online' ? '#10b981' : 'var(--text-secondary)'}} />
                <span>{m.name}</span>
              </NavLink>
            )
          })}
          
          <span className="nav-label" style={{marginTop: '20px'}}>Team</span>
          <div className="nav-item" onClick={() => setIsTeamModalOpen(true)}>
            <Users size={20} />
            <span>Members</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn btn-ghost" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {isTeamModalOpen && <TeamModal onClose={() => setIsTeamModalOpen(false)} />}
    </>
  );
};

export default Sidebar;
