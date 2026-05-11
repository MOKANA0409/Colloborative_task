import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Shield, MessageCircle, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const TeamModal = ({ onClose }) => {
  const { teamMembers, removeTeamMember } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin';

  const handleMessage = (memberId) => {
    onClose();
    navigate('/messages', { state: { targetUserId: memberId } });
  };

  const handleRemove = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;
    const success = await removeTeamMember(memberId);
    if (success) {
      alert(`${memberName} has been removed from the team.`);
    } else {
      alert('Failed to remove user. Make sure the backend is running.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.className === 'modal-backdrop' && onClose()}>
      <div className="modal-content animate-scale-in glass-panel" style={{maxWidth: '600px'}}>
        <div className="modal-header">
          <h2 style={{margin:0, fontSize:'1.2rem', color: '#fff'}}>Project Team Members</h2>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>
        
        <div style={{padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto'}}>
          {teamMembers.map(member => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{position: 'relative'}}>
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', backgroundColor: member.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem'}}>
                    {member.name.charAt(0)}
                  </div>
                  <div style={{position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--bg-color-secondary)',
                    backgroundColor: member.status === 'online' ? '#10b981' : member.status === 'busy' ? '#ef4444' : '#64748b'
                  }}></div>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{color: '#fff', fontWeight: '600', fontSize: '1.05rem'}}>{member.name}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                    <Mail size={12} /> {member.email}
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'}}>
                  {member.role === 'Admin' && <Shield size={12} style={{color: '#a855f7'}} />}
                  {member.role || 'Member'}
                </div>
                <button 
                  className="btn btn-outline" 
                  style={{padding: '6px 12px', fontSize: '0.8rem'}}
                  onClick={() => handleMessage(member.id)}
                >
                  <MessageCircle size={14} /> Message
                </button>
                {isAdmin && member.id !== user?.id && (
                  <button 
                    className="btn" 
                    style={{padding: '6px 10px', fontSize: '0.8rem', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px'}}
                    onClick={() => handleRemove(member.id, member.name)}
                    title="Remove user (Admin only)"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!isAdmin && (
          <div style={{padding: '12px 24px 24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem'}}>
            Only Admins can remove team members.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamModal;
