import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Board from '../components/Kanban/Board';
import TaskModal from '../components/Modals/TaskModal';
import CreateTaskModal from '../components/Modals/CreateTaskModal';
import TeamModal from '../components/Modals/TeamModal';
import ChannelDrawer from '../components/Slack/ChannelDrawer';
import DirectMessageDrawer from '../components/Slack/DirectMessageDrawer';
import { Plus, Hash } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import './ProjectBoard.css';

const ProjectBoard = () => {
  const { boardData, updateBoardData } = useAppContext();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTeamViewing, setIsTeamViewing] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeChannel = searchParams.get('channel');
  const activeDM = searchParams.get('dm');

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      updateBoardData({ ...boardData, columns: { ...boardData.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    updateBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    // Fire DB Update to sync status movement
    const movedTask = boardData.tasks[draggableId];
    if (movedTask && movedTask.dbId) {
       try {
         await fetch(`http://localhost:8082/tasks/${movedTask.dbId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ status: destination.droppableId })
         });
       } catch(err) { console.error("Could not sync drop to DB", err); }
    }
  };

  const handleCreateTask = async ({ title, priority, deadline }) => {
    let dbId = Date.now().toString().substring(5); // Fallback ID
    
    // Safely assign to the first available column instead of crashing if 'TODO' vanishes
    const targetListId = boardData.columns['TODO'] ? 'TODO' : boardData.columnOrder[0];
    if (!targetListId) {
      alert("Error: Please create at least one List first.");
      setIsCreating(false);
      return;
    }

    try {
      // Direct REST call to the running task-service container
      const response = await fetch('http://localhost:8082/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: title, 
          description: "New backend integrated task", 
          status: targetListId, 
          userId: user?.id || 1,
          priority: priority,
          deadline: deadline,
          type: "Task"
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const savedTask = await response.json();
      dbId = savedTask.id;
    } catch (err) {
      console.error("Backend save failed, using local mock state:", err);
      alert("Warning: Could not save to Database. Run Docker and Java Backend.");
    }
    
    const newTaskId = `task-${dbId}`;
    const newTask = {
      id: newTaskId,
      dbId: dbId,
      ticketId: `NEX-${dbId}`,
      title,
      priority,
      deadline,
      assignee: { name: user?.name || 'You' },
      comments: [], 
      attachments: [],
      subtasks: [],
      storyPoints: '-',
      labels: []
    };

    const newTasks = { ...boardData.tasks, [newTaskId]: newTask };
    const newColumn = {
      ...boardData.columns[targetListId],
      taskIds: [...boardData.columns[targetListId].taskIds, newTaskId]
    };

    updateBoardData({
      ...boardData,
      tasks: newTasks,
      columns: {
        ...boardData.columns,
        [targetListId]: newColumn
      }
    });

    setIsCreating(false);
  };
  
  const handleTaskUpdate = async (updatedTask) => {
    // Sink to database to verify it supports payload size before updating UI
    if (updatedTask.dbId) {
      try {
         const response = await fetch(`http://localhost:8082/tasks/${updatedTask.dbId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             title: updatedTask.title,
             description: updatedTask.description,
             status: updatedTask.status,
             priority: updatedTask.priority,
             deadline: updatedTask.deadline,
             storyPoints: updatedTask.storyPoints,
             type: updatedTask.type,
             comments: JSON.stringify(updatedTask.comments),
             subtasks: JSON.stringify(updatedTask.subtasks),
             labels: JSON.stringify(updatedTask.labels),
             attachments: JSON.stringify(updatedTask.attachments)
           })
         });
         
         if (!response.ok) throw new Error("SQL rejected payload. Ensure MariaDB schema matches Entity LONGTEXT or file is too large.");

         // Success! Update UI strictly
         updateBoardData({
           ...boardData,
           tasks: {
             ...boardData.tasks,
             [updatedTask.id]: updatedTask
           }
         });
         setSelectedTask(updatedTask);
      } catch(err) { 
         console.error("Could not sync task edit to DB", err);
         alert(err.message);
      }
    } else {
      updateBoardData({
        ...boardData,
        tasks: {
          ...boardData.tasks,
          [updatedTask.id]: updatedTask
        }
      });
      setSelectedTask(updatedTask);
    }
  };

  const handleCreateList = async (title) => {
    const listId = `col-${Date.now()}`;
    const newPos = boardData.columnOrder.length;
    
    try {
      await fetch('http://localhost:8082/lists', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ listId, title, positionIndex: newPos })
      });
    } catch(err) { console.error(err); }

    updateBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [listId]: { id: listId, title: title, taskIds: [] }
      },
      columnOrder: [...boardData.columnOrder, listId]
    });
  };


  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      <div className="project-board-container" style={{ flex: 1, overflowX: 'auto', borderRight: activeChannel ? '1px solid var(--border-color)' : 'none' }}>
        <div className="board-header">
          <div>
            <h1>Nexus Re-architecture</h1>
            <p className="subtitle">Frontend redesign and optimization sprint</p>
          </div>
        
        <div className="board-actions">
          <div className="board-members" onClick={() => setIsTeamViewing(true)} style={{cursor: 'pointer'}} title="View Team">
            <span className="member-avatar">A</span>
            <span className="member-avatar" style={{background: '#f59e0b'}}>S</span>
            <span className="member-avatar" style={{background: '#10b981'}}>M</span>
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

        <div className="board-wrapper animate-fade-in">
          <Board data={boardData} onDragEnd={onDragEnd} onTaskClick={(task) => setSelectedTask(task)} onCreateList={handleCreateList} />
        </div>

        {selectedTask && (
          <TaskModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onSave={handleTaskUpdate}
          />
        )}
        
        {isCreating && (
          <CreateTaskModal onClose={() => setIsCreating(false)} onCreate={handleCreateTask} />
        )}

        {isTeamViewing && (
          <TeamModal onClose={() => setIsTeamViewing(false)} />
        )}
      </div>

      {activeChannel && (
        <ChannelDrawer 
          channelId={activeChannel} 
          onClose={() => {
            searchParams.delete('channel');
            navigate({ search: searchParams.toString() });
          }} 
        />
      )}

      {activeDM && (
        <DirectMessageDrawer 
          receiverId={activeDM} 
          onClose={() => {
            searchParams.delete('dm');
            navigate({ search: searchParams.toString() });
          }} 
        />
      )}
    </div>
  );
};

export default ProjectBoard;
