import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const DirectMessageDrawer = ({ receiverId, onClose }) => {
  const { privateMessages, sendPrivateMessage, teamMembers } = useAppContext();
  const { user } = useAuth();
  const [text, setText] = useState('');

  // Find recipient data
  const receiver = teamMembers.find(m => m.id.toString() === receiverId.toString()) || { name: 'Unknown User' };

  // Filter messages between active user and receiver
  const messages = privateMessages.filter(
    msg => (msg.senderId === user.id && msg.receiverId.toString() === receiverId) ||
           (msg.receiverId === user.id && msg.senderId.toString() === receiverId)
  );

  const handleSend = () => {
    if (text.trim()) {
      sendPrivateMessage(user.id, receiverId, text);
      setText('');
    }
  };

  return (
    <div className="channel-drawer animate-slide-in">
      <div className="drawer-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-color)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div style={{width: '32px', height: '32px', borderRadius: '50%', background: receiver.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold'}}>
             {receiver.name.charAt(0)}
          </div>
          <div>
            <h3 style={{margin: 0, fontSize: '1.1rem'}}>{receiver.name}</h3>
            <span style={{fontSize: '0.8rem', color: receiver.status === 'online' ? '#10b981' : 'var(--text-secondary)'}}>
              {receiver.status === 'online' ? 'Active now' : 'Offline'}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="btn-ghost" style={{padding: '4px'}}><X size={20}/></button>
      </div>

      <div className="drawer-messages" style={{flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {messages.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)'}}>
            <User size={32} style={{margin: '0 auto 12px auto', opacity: 0.5}} />
            <p>This is the beginning of your direct message history with {receiver.name}.</p>
          </div>
        )}
        
        {messages.map(msg => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} style={{alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%'}}>
              {!isMe && <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '4px'}}>{receiver.name}</span>}
              <div style={{
                background: isMe ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', 
                color: '#fff', 
                padding: '10px 14px', 
                borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0'
              }}>
                {msg.text}
              </div>
              <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)', float: isMe ? 'right' : 'left', marginTop: '4px'}}>{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      <div className="drawer-input" style={{padding: '16px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)'}}>
        <div style={{display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px'}}>
          <input 
            type="text" 
            placeholder={`Message ${receiver.name}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '8px 12px', outline: 'none'}}
          />
          <button onClick={handleSend} className="btn-primary" style={{padding: '8px', borderRadius: '6px', background: text.trim() ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: text.trim() ? 'pointer' : 'default'}}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageDrawer;
