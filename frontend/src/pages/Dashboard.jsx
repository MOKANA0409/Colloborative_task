import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Briefcase, CheckCircle2, AlertCircle, Clock, Zap, ListTodo } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { boardData } = useAppContext();

  // Compute real metrics from the live board state
  const allTasks = Object.values(boardData.tasks || {});
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === 'DONE').length;
  const pendingTasks = allTasks.filter(t => t.status !== 'DONE').length;
  const activeProjects = boardData.columnOrder?.length || 0;

  // Get the most recent tasks for the summary list
  const recentTasks = allTasks.slice(-5).reverse();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p>Here's what's happening with your projects today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{activeProjects}</span>
            <span className="stat-label">Active Lists</span>
          </div>
        </div>
        
        <div className="stat-card glass-panel animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{pendingTasks}</span>
            <span className="stat-label">Tasks Pending</span>
          </div>
        </div>

        <div className="stat-card glass-panel animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{doneTasks}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
        </div>

        <div className="stat-card glass-panel animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content grid-layout">
        <div className="recent-tasks glass-panel animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="section-header">
            <h3>My Assigned Tasks</h3>
            <Link to="/project/1" className="btn btn-outline btn-sm">View Board</Link>
          </div>
          
          <div className="task-list">
            {recentTasks.length === 0 && (
              <p style={{padding: '20px', color: 'var(--text-secondary)', textAlign: 'center'}}>No tasks yet. Create one on the Board!</p>
            )}
            {recentTasks.map(task => (
              <div key={task.id} className="summary-task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <div className="task-meta">
                    <span className={`status-badge ${(task.status || 'todo').toLowerCase().replace(' ', '_')}`}>{(task.status || 'TODO').replace('_', ' ')}</span>
                    {task.deadline && <span className="deadline"><Clock size={14}/> {task.deadline}</span>}
                  </div>
                </div>
                <div className={`priority-indicator ${(task.priority || 'medium').toLowerCase()}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-report glass-panel animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="section-header ai-header">
            <Zap size={20} className="ai-icon" />
            <h3>AI Productivity Insights</h3>
          </div>
          
          <div className="report-content">
            <div className="report-item success">
              <CheckCircle2 size={18} />
              <p>You have completed <strong>{doneTasks}</strong> out of <strong>{totalTasks}</strong> total tasks{totalTasks > 0 ? ` (${Math.round((doneTasks/totalTasks)*100)}%)` : ''}.</p>
            </div>
            {pendingTasks > 0 && (
              <div className="report-item warning">
                <AlertCircle size={18} />
                <p>There {pendingTasks === 1 ? 'is' : 'are'} <strong>{pendingTasks}</strong> pending task{pendingTasks !== 1 ? 's' : ''} remaining across your board.</p>
              </div>
            )}
            
            <div className="ai-suggestion">
              <strong>💡 Suggestion:</strong> {pendingTasks > 3 ? 'Consider breaking large tasks into subtasks for better velocity tracking.' : 'Great pace! Keep focusing on high-priority items first.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
