import React, { useState } from 'react';
import { X } from 'lucide-react';
import './TaskModal.css';

const CreateTaskModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, priority, deadline });
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.className === 'modal-backdrop' && onClose()}>
      <div className="modal-content animate-scale-in glass-panel" style={{maxWidth: '500px'}}>
        <div className="modal-header">
          <h2 style={{margin:0, fontSize:'1.2rem', color: '#fff'}}>Create New Task</h2>
          <button className="close-btn" onClick={onClose}><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} style={{padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label className="label">Task Title</label>
            <input 
              className="input-field" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="E.g. Fix navigation bug" 
              autoFocus 
              required 
            />
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input-field" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input 
              type="date" 
              className="input-field" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
              required 
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px'}}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
