import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_TEAM = []; // Fetched dynamically
const INITIAL_CHANNELS = [
  { id: 'team-updates', name: 'team-updates', unread: 0 },
  { id: 'bugs', name: 'bugs', unread: 2 }
];

export const AppProvider = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM);
  const [boardData, setBoardData] = useState({ tasks: {}, columns: {}, columnOrder: [] });
  const [privateMessages, setPrivateMessages] = useState([]);
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [channelMessages, setChannelMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch initial Database state
  useEffect(() => {
    const fetchFullState = async () => {
      try {
        // Fetch Users (Team)
        const userRes = await fetch('http://localhost:8081/users');
        if (userRes.ok) {
          let users = await userRes.json();
          
          if (users.length === 0) {
            // Auto-Seed Demo Users if DB is blank
            const demoUsers = [
              { name: 'Alex Developer', email: 'alex@demo.com', role: 'Developer', password: '123', color: '#3b82f6' },
              { name: 'Sarah Manager', email: 'sarah@demo.com', role: 'Manager', password: '123', color: '#f59e0b' },
              { name: 'Mike Admin', email: 'mike@demo.com', role: 'Admin', password: '123', color: '#10b981' }
            ];
            for (const dm of demoUsers) {
               await fetch('http://localhost:8081/users', {
                 method: 'POST', headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify(dm)
               });
            }
            const refreshRes = await fetch('http://localhost:8081/users');
            if (refreshRes.ok) users = await refreshRes.json();
          }
          
          setTeamMembers(users.map(u => ({ ...u, status: 'online', color: u.color || '#3b82f6' })));
        }

        // Fetch Columns (Lists)
        const listRes = await fetch('http://localhost:8082/lists');
        let rawLists = [];
        if (listRes.ok) rawLists = await listRes.json();
        
        if (rawLists.length === 0) {
          // Setup defaults if DB empty
          rawLists = [
            { listId: 'TODO', title: 'To Do', positionIndex: 0 },
            { listId: 'IN_PROGRESS', title: 'In Progress', positionIndex: 1 },
            { listId: 'DONE', title: 'Done', positionIndex: 2 }
          ];
          for(const l of rawLists) {
             await fetch('http://localhost:8082/lists', {
               method: 'POST', headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(l)
             });
          }
        }

        const cols = {};
        const colOrder = rawLists.sort((a,b)=>a.positionIndex - b.positionIndex).map(l => l.listId);
        rawLists.forEach(l => {
          cols[l.listId] = { id: l.listId, title: l.title, taskIds: [] };
        });

        // Fetch Tasks
        const taskRes = await fetch('http://localhost:8082/tasks');
        if (taskRes.ok) {
          const tasks = await taskRes.json();
          const taskMap = {};
          
          tasks.forEach(t => {
            const frontendId = `task-${t.id}`;
            const parsedComments = t.comments ? JSON.parse(t.comments) : [];
            const parsedSubtasks = t.subtasks ? JSON.parse(t.subtasks) : [];
            const parsedLabels = t.labels ? JSON.parse(t.labels) : [];
            const parsedAttachments = t.attachments ? JSON.parse(t.attachments) : [];
            
            taskMap[frontendId] = {
              id: frontendId,
              dbId: t.id,
              ticketId: `NEX-${t.id}`,
              title: t.title,
              description: t.description,
              status: t.status,
              priority: t.priority || 'Medium',
              deadline: t.deadline || '',
              assignee: { id: t.userId, name: 'Assigned User' }, 
              storyPoints: t.storyPoints || '-',
              type: t.type || 'Task',
              comments: parsedComments,
              subtasks: parsedSubtasks,
              labels: parsedLabels,
              attachments: parsedAttachments
            };
            
            // Map into column with strict dynamic fallbacks
            let targetCol = t.status || (colOrder.length > 0 ? colOrder[0] : null);
            if(targetCol && !cols[targetCol]) {
               targetCol = colOrder.length > 0 ? colOrder[0] : null; 
            }
            if(targetCol && cols[targetCol]) {
               cols[targetCol].taskIds.push(frontendId);
            }
          });
          
          setBoardData({ tasks: taskMap, columns: cols, columnOrder: colOrder });
        }
      } catch(err) {
        console.error("Database connection failed, UI will not render components", err);
      }
    };
    fetchFullState();
  }, []);

  const addTeamMember = (newUser) => { /* Handled via Register */ };

  // Only updates local state. API requests handled by components to ensure granularity.
  const updateBoardData = (newData) => {
    setBoardData(newData);
  };

  const sendPrivateMessage = (senderId, receiverId, text) => {
    setPrivateMessages(prev => [...prev, { id: Date.now(), senderId, receiverId, text, timestamp: new Date().toLocaleTimeString() }]);
    
    // Generate notification for the receiver
    const sender = teamMembers.find(m => m.id === senderId);
    const senderName = sender?.name || 'Someone';
    setNotifications(prev => [
      { id: Date.now(), text: `New message from ${senderName}: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`, read: false, receiverId: receiverId },
      ...prev
    ]);
  };

  const sendChannelMessage = (senderId, channelId, text) => {
    setChannelMessages(prev => [...prev, { id: Date.now(), channelId, senderId, text, timestamp: new Date().toLocaleTimeString() }]);
  };

  const removeTeamMember = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        setTeamMembers(prev => prev.filter(m => m.id !== userId));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
    return false;
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{ 
      teamMembers, addTeamMember, 
      boardData, updateBoardData, 
      privateMessages, sendPrivateMessage,
      channels, channelMessages, sendChannelMessage,
      notifications, markNotificationsRead,
      removeTeamMember
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
