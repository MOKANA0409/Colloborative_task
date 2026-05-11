import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MessageSquare, Paperclip, AlertTriangle, Hash, CheckSquare } from 'lucide-react';
import './Kanban.css';

const TaskCard = ({ task, index, onClick }) => {
  const ticketId = task.ticketId || `NEX-${task.id.replace(/\D/g, '') || 'NEW'}`;
  const commentsCount = task.comments?.length || 0;
  const attachmentsCount = task.attachments?.length || 0;
  const labels = task.labels || [];
  const subtasks = task.subtasks || [];
  
  const completedSubtasks = subtasks.filter(st => st.done).length;

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          onClick={() => onClick(task)}
        >
          {labels.length > 0 && (
            <div className="task-labels" style={{display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px'}}>
              {labels.map((lbl, i) => (
                <div key={i} style={{background: lbl.color, width: '32px', height: '6px', borderRadius: '4px'}} title={lbl.name}></div>
              ))}
            </div>
          )}

          <div className="task-card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
            <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)'}}>{ticketId}</span>
            <div style={{display: 'flex', gap: '6px'}}>
              <span className={`task-priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              {task.aiSuggested && (
                <span className="ai-badge" title="AI Suggested Priority">
                  <AlertTriangle size={12} /> AI
                </span>
              )}
            </div>
          </div>
          
          <h4 className="task-title" style={{marginTop: '2px', marginBottom: '12px'}}>{task.title}</h4>
          
          <div className="task-card-footer" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div className="task-date" style={{display: 'flex', alignItems: 'center'}}>
              <Clock size={12} style={{marginRight: '4px'}} /> <span style={{fontSize: '0.75rem'}}>{task.deadline}</span>
            </div>
            
            <div className="task-metrics" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              {subtasks.length > 0 && (
                <span className="metric" style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: completedSubtasks === subtasks.length ? '#10b981' : 'var(--text-secondary)'}}>
                  <CheckSquare size={12} /> {completedSubtasks}/{subtasks.length}
                </span>
              )}
              {commentsCount > 0 && (
                <span className="metric" style={{display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: 'var(--text-secondary)'}}><MessageSquare size={12} /> {commentsCount}</span>
              )}
              {attachmentsCount > 0 && (
                <span className="metric" style={{display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: 'var(--text-secondary)'}}><Paperclip size={12} /> {attachmentsCount}</span>
              )}
              {task.storyPoints && (
                <span className="metric" style={{background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px'}}>
                  <Hash size={10}/> {task.storyPoints}
                </span>
              )}
              
              <div className="task-assignee" title={task.assignee?.name || 'Unassigned'} style={{width: '24px', height: '24px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', fontWeight: 'bold', marginLeft: '4px'}}>
                {task.assignee?.name?.charAt(0) || '?'}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
