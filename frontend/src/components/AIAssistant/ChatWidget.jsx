import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Project Assistant. You can ask me things like 'What tasks are due tomorrow?' or 'How many tasks in the DB?'", isBot: true }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { text: query, isBot: false }]);
    const currentQuery = query.toLowerCase();
    setQuery("");

    
    setMessages(prev => [...prev, { text: "...", isBot: true, isTyping: true }]);

    setTimeout(async () => {
      let reply = "";
      
      const genericAdvice = [
        "In my analysis, breaking this down into smaller sub-tasks will improve velocity.",
        "I recommend checking the Kanban board to see who is available to help with that.",
        "That's a great question. Based on current trends, we are on track, but keep an eye on blockers.",
        "I've noted that! You might want to update the project documentation to reflect this.",
        "From a management perspective, ensuring alignment on this will save us time next week.",
        "I don't have direct access to that specific file yet, but conventionally, doing it iteratively is the best approach."
      ];

      if(currentQuery.includes("tomorrow")) {
        reply = "You have 2 tasks due tomorrow: 'Fix Login Bug' and 'Update Documentation'.";
      } else if (currentQuery.includes("hello") || currentQuery.includes("hi")) {
        reply = "Hello there! How can I assist your productivity today?";
      } else if (currentQuery.includes("priority") || currentQuery.includes("urgent")) {
        reply = "Your highest priority task right now is 'Determine React architecture'.";
      } else if (currentQuery.includes("progress") || currentQuery.includes("status")) {
        reply = "Looking good! Your team velocity is up 15% this week and all tasks are currently on track.";
      } else if (currentQuery.includes("who") && currentQuery.includes("admin")) {
        reply = "Mike is the current system Admin. You can reach out to him via Direct Messages.";
      } else if (currentQuery.includes("create") || currentQuery.includes("new task")) {
        reply = "To create a task, navigate to the Active Project board and click the blue 'Create Task' button in the top right.";
      } else if (currentQuery.includes("deadline")) {
        reply = "You can change deadlines directly inside the Task Modal. Just click a task on the Kanban board.";
      } else if (currentQuery.includes("bye")) {
        reply = "Goodbye! Let me know if you need any more project insights.";
      } else {
        // Pseudo-AI dynamic database context
        try {
          const taskRes = await fetch('http://localhost:8082/tasks');
          if (taskRes.ok) {
             const allTasks = await taskRes.json();
             if (currentQuery.includes("how many") || currentQuery.includes("count") || currentQuery.includes("total")) {
                reply = `I have scanned the MariaDB logs. You currently have ${allTasks.length} active tasks recorded!`;
             } else if (currentQuery.includes("todo") || currentQuery.includes("to do")) {
                const count = allTasks.filter(t => t.status === 'TODO').length;
                reply = `There are ${count} task tickets currently waiting in your TO-DO list.`;
             } else if (currentQuery.includes("done") || currentQuery.includes("completed")) {
                const count = allTasks.filter(t => t.status === 'DONE').length;
                reply = `You have successfully completed ${count} tasks so far. Keep it up!`;
             } else {
                const randomFallback = genericAdvice[Math.floor(Math.random() * genericAdvice.length)];
                reply = `To help with "${query.substring(0, 20)}${query.length > 20 ? '...' : ''}": ${randomFallback}`;
             }
          } else {
             reply = "System Warning: Your Spring Boot backend appears disconnected from the SQL Database.";
          }
        } catch(err) {
             reply = "Connection Refused. Run Docker and ensure your Java microservices are listening on port 8082!";
        }
      }

      setMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { text: reply, isBot: true }];
      });
    }, 1200);
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window animate-slide-up glass-panel">
          <div className="chat-header">
            <Bot className="bot-icon" size={20} />
            <span>AI Assistant</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      
      {!isOpen && (
        <button 
          className="chat-toggle animate-pulse-glow" 
          onClick={() => setIsOpen(true)}
        >
          <Bot size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
