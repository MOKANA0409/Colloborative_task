import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { teamMembers, privateMessages, sendPrivateMessage } = useAppContext();
  const { user } = useAuth();
  const location = useLocation();

  // Determine active user to chat with based on location state or default to first valid team member
  const initialTargetObj = location.state?.targetUserId 
    ? teamMembers.find(m => m.id === location.state.targetUserId) 
    : teamMembers.find(m => m.email !== user?.email);

  const [activeUser, setActiveUser] = useState(initialTargetObj);
  const [draftMessage, setDraftMessage] = useState('');

  // Auto-scroll logic or sync if teamMember state changes
  useEffect(() => {
    if (location.state?.targetUserId) {
      const u = teamMembers.find(m => m.id === location.state.targetUserId);
      if (u) setActiveUser(u);
    }
  }, [location.state, teamMembers]);

  // Current User ID (normally passed by backend, we mock it via user email lookup or default to ID 1)
  const currentUserId = teamMembers.find(m => m.email === user?.email)?.id || 1;

  // Filter messages specifically between currentUser and activeUser
  const chatHistory = activeUser ? privateMessages.filter(
    m => (m.senderId === currentUserId && m.receiverId === activeUser.id) ||
         (m.senderId === activeUser.id && m.receiverId === currentUserId)
  ) : [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!draftMessage.trim() || !activeUser) return;
    
    sendPrivateMessage(currentUserId, activeUser.id, draftMessage);
    setDraftMessage('');
  };

  return (
    <div className="messages-container fade-in">
      <div className="messages-sidebar glass-panel">
        <div className="sidebar-header">
          <h3><Users size={18} /> Direct Messages</h3>
        </div>
        <div className="inbox-list">
          {teamMembers.filter(m => m.id !== currentUserId).map(member => (
            <div 
              key={member.id} 
              className={`inbox-item ${activeUser?.id === member.id ? 'active' : ''}`}
              onClick={() => setActiveUser(member)}
            >
              <div className="member-avatar small" style={{background: member.color || '#3b82f6'}}>
                {member.name.charAt(0)}
              </div>
              <div className="inbox-info">
                <span className="name">{member.name}</span>
                <span className="role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="messages-main glass-panel">
        {activeUser ? (
          <>
            <div className="chat-header">
              <div className="member-avatar small" style={{background: activeUser.color || '#3b82f6'}}>
                {activeUser.name.charAt(0)}
              </div>
              <div>
                <h4 style={{margin: 0, fontSize: '1.1rem'}}>{activeUser.name}</h4>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                   <span style={{width: '8px', height: '8px', borderRadius: '50%', background: activeUser.status === 'online' ? '#10b981' : '#64748b'}}></span>
                   {activeUser.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>

            <div className="chat-area">
              {chatHistory.length === 0 ? (
                <div className="empty-state">No messages yet. Send a message to start chatting!</div>
              ) : (
                chatHistory.map(msg => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`chat-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                      <div className="chat-bubble">
                        <p>{msg.text}</p>
                        <span className="chat-timestamp">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form className="chat-input-wrapper" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder={`Message ${activeUser.name}...`} 
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="btn btn-primary" disabled={!draftMessage.trim()}>
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="empty-state">Select a team member to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
