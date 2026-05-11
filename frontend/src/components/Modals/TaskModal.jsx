import React, { useState } from 'react';
import { X, Clock, UploadCloud, FileText, CheckCircle2, Circle, AlertCircle, Hash, PlaySquare, Bookmark } from 'lucide-react';
import './TaskModal.css';

const TaskModal = ({ task, onClose, onSave }) => {
  const [comment, setComment] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [deadline, setDeadline] = useState(task.deadline || "");

  // Default to Jira-esque fields if undefined
  const storyPoints = task.storyPoints || '-';
  const labels = task.labels || [];
  const subtasks = task.subtasks || [];
  const ticketId = task.ticketId || `NEX-${task.id.replace(/\D/g, '') || 'NEW'}`;

  // Handle file upload via Base64 mapping
  // Handle file upload via Base64 mapping, intercept high-res photos and compress them locally
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0] && onSave) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (file.type.startsWith('image/')) {
          // COMPRESS HIGH-RES IMAGES
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH > img.width ? img.width : MAX_WIDTH;
            canvas.height = MAX_WIDTH > img.width ? img.height : img.height * scaleSize;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            const updatedTask = {
              ...task,
              attachments: [...(task.attachments || []), { name: file.name, dataUrl: compressedBase64 }]
            };
            onSave(updatedTask);
          };
          img.src = event.target.result;
        } else {
           // STANDARD FILE HANDLING
           const updatedTask = {
             ...task,
             attachments: [...(task.attachments || []), { name: file.name }]
           };
           onSave(updatedTask);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle comment post globally
  const handlePostComment = () => {
    if (!comment.trim() || !onSave) return;
    const newComment = { text: comment, author: 'You' };
    const updatedTask = { ...task, comments: [...(task.comments || []), newComment] };
    onSave(updatedTask);
    setComment("");
  };

  // Handle subtask mapping
  const toggleSubtask = (stId) => {
    if(!onSave) return;
    const updatedTask = {
      ...task,
      subtasks: subtasks.map(st => st.id === stId ? { ...st, done: !st.done } : st)
    };
    onSave(updatedTask);
  };

  const handleAddSubtask = () => {
    if(!newSubtask.trim() || !onSave) return;
    const stObj = { id: `st-${Date.now()}`, text: newSubtask, done: false };
    const updatedTask = {
      ...task,
      subtasks: [...subtasks, stObj]
    };
    onSave(updatedTask);
    setNewSubtask("");
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Bug': return <AlertCircle size={16} color="#ef4444" />;
      case 'Story': return <Bookmark size={16} color="#10b981" />;
      case 'Epic': return <PlaySquare size={16} color="#a855f7" />;
      default: return <CheckCircle2 size={16} color="#3b82f6" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.className === 'modal-backdrop' && onClose()}>
      <div className="modal-content animate-scale-in glass-panel" style={{maxWidth: '900px', display: 'flex', flexDirection: 'column'}}>
        
        {/* JIRA HEADER */}
        <div className="modal-header" style={{borderBottom: '1px solid var(--border-color)', padding: '16px 24px'}}>
          <div className="modal-header-left" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
              {getTypeIcon(task.type)}
              <span className="task-id" style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{ticketId}</span>
            </div>
            {labels.map((lbl, idx) => (
              <span key={idx} style={{background: lbl.color, color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'}}>{lbl.name}</span>
            ))}
          </div>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>
        
        <div className="modal-body" style={{display: 'flex', padding: 0}}>
          {/* MAIN (LEFT) COLUMN */}
          <div className="modal-main-col" style={{flex: 2, padding: '24px', borderRight: '1px solid var(--border-color)', overflowY: 'auto', maxHeight: '75vh'}}>
            <h2 className="modal-task-title" style={{fontSize: '1.5rem', marginBottom: '24px'}}>{task.title}</h2>
            
            <div className="description-section" style={{marginBottom: '32px'}}>
              <h3 style={{fontSize: '1.05rem', marginBottom: '12px'}}>Description</h3>
              <div className="task-desc" style={{padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px'}}>
                Need to thoroughly examine and refactor the architecture to support real-time state management.
              </div>
            </div>

            {/* SUBTASKS: JIRA STYLE */}
            <div className="subtasks-section" style={{marginBottom: '32px'}}>
              <h3 style={{fontSize: '1.05rem', marginBottom: '12px'}}>Subtasks</h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px'}}>
                {subtasks.length === 0 && <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>No subtasks yet.</span>}
                {subtasks.map(st => (
                  <div key={st.id} onClick={() => toggleSubtask(st.id)} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--border-color)'}}>
                    {st.done ? <CheckCircle2 size={18} color="#10b981"/> : <Circle size={18} color="var(--text-secondary)"/>}
                    <span style={{textDecoration: st.done ? 'line-through' : 'none', color: st.done ? 'var(--text-secondary)' : 'var(--text-primary)'}}>{st.text}</span>
                  </div>
                ))}
              </div>

              <div style={{display: 'flex', gap: '8px'}}>
                <input 
                  type="text" 
                  placeholder="Add a subtask..." 
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  style={{flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px dashed var(--border-color)', background: 'transparent', color: '#fff', outline: 'none', fontSize: '0.9rem'}}
                />
                <button onClick={handleAddSubtask} disabled={!newSubtask.trim()} className="btn-primary" style={{padding: '0 16px', borderRadius: '6px', border: 'none', cursor: newSubtask.trim() ? 'pointer' : 'default'}}>
                  Add
                </button>
              </div>
            </div>

            <div className="attachments-section" style={{marginBottom: '32px'}}>
              <h3 style={{fontSize: '1.05rem', marginBottom: '12px'}}>Attachments</h3>
              <label className="file-upload-zone" style={{display: 'block', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', padding: '24px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', transition: 'border-color 0.2s'}}>
                <input type="file" style={{display: 'none'}} onChange={handleFileUpload} />
                <UploadCloud size={24} className="upload-icon" style={{margin: '0 auto 12px auto'}} />
                <p style={{margin: '0 0 4px 0'}}>Drag & drop files or <span style={{color: 'var(--accent-color)'}}>browse</span></p>
                <span className="upload-hint" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Support docs, screenshots, designs (max 5MB)</span>
              </label>
              
              <div className="attached-files" style={{marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                {task.attachments?.map((att, idx) => (
                  <div key={idx} className="file-item-card" style={{display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', minWidth: '200px'}}>
                    {att.dataUrl && att.dataUrl.startsWith('data:image') ? (
                       <img src={att.dataUrl} alt={att.name} style={{width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px'}} />
                    ) : (
                       <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'}}><FileText size={14} /> {att.name}</div>
                    )}
                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-all'}}>{att.name}</span>
                    <input 
                      type="text" 
                      placeholder="Comment on file..." 
                      style={{width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', outline: 'none', fontSize: '0.8rem'}}
                      onKeyDown={(e) => {
                         if(e.key === 'Enter' && e.target.value.trim() && onSave) {
                            const newComment = { text: `[On Attachment: ${att.name}] ${e.target.value}`, author: 'You' };
                            const updatedTask = { ...task, comments: [...(task.comments || []), newComment] };
                            onSave(updatedTask);
                            e.target.value = '';
                         }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="comments-section">
              <h3 style={{fontSize: '1.05rem', marginBottom: '16px'}}>Activity</h3>
              
              <div className="comment-input-area" style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                <div className="member-avatar" style={{width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', flexShrink: 0}}>U</div>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="input-field"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    style={{width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none'}}
                  />
                  {comment && (
                    <button className="btn btn-primary" style={{alignSelf: 'flex-start'}} onClick={handlePostComment}>Save</button>
                  )}
                </div>
              </div>

              <div className="comments-list" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {task.comments?.map((c, i) => (
                  <div key={i} style={{display: 'flex', gap: '12px'}}>
                    <div className="member-avatar" style={{width: '32px', height: '32px', borderRadius: '50%', background: c.author === 'You' ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', flexShrink: 0}}>{c.author.charAt(0)}</div>
                    <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px'}}>
                        <strong style={{fontWeight: '600', fontSize: '0.9rem'}}>{c.author}</strong>
                      </div>
                      <div className="comment-bubble" style={{background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem'}}>
                        {c.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* SIDE (RIGHT) COLUMN: JIRA FIELDS */}
          <div className="modal-side-col" style={{flex: 1, padding: '24px', backgroundColor: 'rgba(0,0,0,0.1)', overflowY: 'auto', maxHeight: '75vh'}}>
            <h4 style={{fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px'}}>Details</h4>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Status</span>
                <span className="status-badge todo" style={{alignSelf: 'flex-start', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'}}>To Do</span>
              </div>
              
              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Assignee</span>
                <div className="flex-align" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', borderRadius: '4px', cursor: 'pointer'}}>
                  <div className="member-avatar small" style={{width: '24px', height: '24px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff'}}>{task.assignee.name.charAt(0)}</div>
                  <span style={{fontSize: '0.9rem'}}>{task.assignee.name}</span>
                </div>
              </div>

              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Reporter</span>
                <div className="flex-align" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div className="member-avatar small" style={{width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff'}}>M</div>
                  <span style={{fontSize: '0.9rem'}}>Mike Admin</span>
                </div>
              </div>

              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Story Points</span>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', width: 'fit-content', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem'}}>
                  <Hash size={12} color="var(--text-secondary)" /> {storyPoints}
                </div>
              </div>

              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Priority</span>
                <select 
                  className="input-field" 
                  value={task.priority || 'Medium'}
                  onChange={(e) => onSave({ ...task, priority: e.target.value })}
                  style={{padding: '4px 8px', width: 'fit-content', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', outline: 'none', fontSize: '0.85rem'}}
                >
                  <option value="High" style={{background: '#1e293b'}}>High</option>
                  <option value="Medium" style={{background: '#1e293b'}}>Medium</option>
                  <option value="Low" style={{background: '#1e293b'}}>Low</option>
                </select>
              </div>

              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Type</span>
                <select 
                  className="input-field" 
                  value={task.type || 'Task'}
                  onChange={(e) => onSave({ ...task, type: e.target.value })}
                  style={{padding: '4px 8px', width: 'fit-content', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', outline: 'none', fontSize: '0.85rem'}}
                >
                  <option value="Task" style={{background: '#1e293b'}}>Task</option>
                  <option value="Bug" style={{background: '#1e293b'}}>Bug</option>
                  <option value="Story" style={{background: '#1e293b'}}>Story</option>
                  <option value="Epic" style={{background: '#1e293b'}}>Epic</option>
                </select>
              </div>

              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Deadline</span>
                <div className="flex-align" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Clock size={14} className="text-secondary" />
                  <input 
                    type="date"
                    className="input-field"
                    style={{padding: '4px 8px', width: 'auto', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none'}}
                    value={deadline}
                    onChange={(e) => {
                      setDeadline(e.target.value);
                      onSave({ ...task, deadline: e.target.value });
                    }}
                  />
                </div>
              </div>
              
              <div className="detail-row" style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <span className="detail-label" style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Labels</span>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                  {labels.map((lbl, idx) => (
                    <span key={idx} style={{background: 'rgba(255,255,255,0.1)', border: `1px solid ${lbl.color}`, color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px'}}>{lbl.name}</span>
                  ))}
                  <button style={{background: 'transparent', border: '1px dashed var(--text-secondary)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer'}}>+</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
