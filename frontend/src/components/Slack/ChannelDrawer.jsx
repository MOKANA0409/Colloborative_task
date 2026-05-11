import React, { useState } from 'react';
import { Hash, Send, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const ChannelDrawer = ({ channelId, onClose }) => {
  const { channels, channelMessages, sendChannelMessage, teamMembers } = useAppContext();
  const { user } = useAuth();
  const [draft, setDraft] = useState('');

  const channel = channels.find(c => c.id === channelId);
  const messages = channelMessages.filter(m => m.channelId === channelId);
  
  const currentUserId = teamMembers.find(m => m.email === user?.email)?.id || 1;

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !channel) return;
    sendChannelMessage(currentUserId, channel.id, draft);
    setDraft('');
  };

  if (!channel) return null;

  return (
    <div className="channel-drawer glass-panel" style={{
      width: '350px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-color-secondary)',
      flexShrink: 0
    }}>
      <div style={{padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Hash size={18} color="var(--text-secondary)" />
          <h3 style={{margin: 0, fontSize: '1.1rem'}}>{channel.name}</h3>
        </div>
        <button className="btn-ghost" onClick={onClose} style={{padding: '4px'}}><X size={18}/></button>
      </div>

      <div style={{flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
        {messages.map(msg => {
          const sender = teamMembers.find(m => m.id === msg.senderId);
          return (
            <div key={msg.id} style={{display: 'flex', gap: '12px'}}>
              <div style={{width: '32px', height: '32px', borderRadius: '4px', backgroundColor: sender?.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem'}}>
                {sender?.name?.charAt(0) || 'U'}
              </div>
              <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
                  <span style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{sender?.name || 'Unknown'}</span>
                  <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>{msg.timestamp}</span>
                </div>
                <p style={{margin: '4px 0 0 0', fontSize: '0.9rem', lineHeight: 1.4, color: 'var(--text-primary)'}}>{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} style={{padding: '16px', borderTop: '1px solid var(--border-color)'}}>
        <div style={{display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden'}}>
          <input 
            type="text" 
            placeholder={`Message #${channel.name}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', outline: 'none'}}
          />
          <button type="submit" disabled={!draft.trim()} className="btn-primary" style={{borderRadius: 0, padding: '0 16px', border: 'none', cursor: draft.trim() ? 'pointer' : 'default'}}>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChannelDrawer;
