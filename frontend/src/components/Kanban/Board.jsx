import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';

const Board = ({ data, onDragEnd, onTaskClick, onCreateList }) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = () => {
    if (newListTitle.trim()) {
      onCreateList(newListTitle);
      setNewListTitle('');
      setIsAdding(false);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board" style={{display: 'flex', gap: '24px', alignItems: 'flex-start'}}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} onTaskClick={onTaskClick} />;
        })}
        
        {/* Dynamic Add Column UI */}
        {isAdding ? (
          <div style={{minWidth: '280px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border-color)'}}>
            <input 
              autoFocus
              type="text" 
              placeholder="Enter list title..." 
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
              style={{width: '100%', padding: '8px', borderRadius: '6px', border: 'none', marginBottom: '8px', outline: 'none', background: 'rgba(0,0,0,0.2)', color: '#fff'}}
            />
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={handleAddSubmit} className="btn-primary" style={{padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem'}}>Add</button>
              <button onClick={() => setIsAdding(false)} style={{padding: '6px 12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem'}}>Cancel</button>
            </div>
          </div>
        ) : (
          <div onClick={() => setIsAdding(true)} style={{
            minWidth: '280px', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            border: '1px dashed var(--border-color)',
            transition: 'all 0.2s ease'
          }} className="hover:bg-white/10 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span style={{fontWeight: 'bold'}}>Add another list</span>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default Board;
