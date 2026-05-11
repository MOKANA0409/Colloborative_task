import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ChatWidget from './AIAssistant/ChatWidget';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-content animate-fade-in">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default AppLayout;
