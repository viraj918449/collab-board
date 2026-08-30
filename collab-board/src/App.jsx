// src/App.jsx

import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications'; 
import Tasks from './components/Tasks';
import Schedule from './components/Schedule';
import CalendarPage from './components/CalendarPage';
import Setting from './components/Setting'; 
import Upcomingtask from './components/Upcomingtask'; 
import Profile from './components/Profile'; 
import ActivityHistory from './components/ActivityHistory';
import Team from './components/Team';
import Board from './components/Board';
import ProjectOverview from './components/ProjectOverview';
import NewTask from './components/NewTask';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('token') ? 'dashboard' : 'login');
  const formatDate = (date = new Date()) => date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const [selectedDate, setSelectedDate] = useState(() => formatDate());
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [theme, setTheme] = useState('light'); // <-- Added theme state for Light/Dark mode
  const [dashboardTasks, setDashboardTasks] = useState(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('dashboardTasks') || 'null');
      if (Array.isArray(savedTasks)) return savedTasks;
    } catch {
      localStorage.removeItem('dashboardTasks');
    }

    return [
      { id: 1, title: 'User Roles & Permissions', priority: 'High', status: 'Pending' },
      { id: 2, title: 'Responsive Dashboard', priority: 'Medium', status: 'Pending' },
      { id: 3, title: 'Email Notifications', priority: 'Medium', status: 'Pending' },
    ];
  });
  const [localNotifications, setLocalNotifications] = useState(() => {
    try {
      const savedNotifications = JSON.parse(localStorage.getItem('localNotifications') || '[]');
      return Array.isArray(savedNotifications) ? savedNotifications : [];
    } catch {
      localStorage.removeItem('localNotifications');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dashboardTasks', JSON.stringify(dashboardTasks));
  }, [dashboardTasks]);

  useEffect(() => {
    localStorage.setItem('localNotifications', JSON.stringify(localNotifications));
  }, [localNotifications]);

  const handleTaskCreated = (task) => {
    setDashboardTasks((currentTasks) => [task, ...currentTasks]);
    setLocalNotifications((currentNotifications) => [
      {
        _id: `local-${Date.now()}`,
        type: 'task_created',
        actor: { name: 'You' },
        message: `You created a new task: ${task.title}`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...currentNotifications,
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('collabToken');
    localStorage.removeItem('collabUser');
    setCurrentView('login');
  };

  // Updated navigation handler to accept an optional second argument for the date payload
  const handleNavigate = (view, date = null) => {
    if (view.toLowerCase() === 'board' && date) {
      setSelectedBoardId(date);
    } else if (date) {
      setSelectedDate(date);
    }
    setCurrentView(view.toLowerCase());
  };

  const renderPlaceholderView = (title, description) => (
    <div style={{ minHeight: '100vh', padding: '40px', boxSizing: 'border-box', background: theme === 'dark' ? '#0f172a' : '#f8fafc', color: theme === 'dark' ? '#f8fafc' : '#0f172a', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <p>{description}</p>
      <button
        type="button"
        onClick={() => handleNavigate('dashboard')}
        style={{ padding: '8px 16px', background: '#4F5D55', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Back to dashboard
      </button>
    </div>
  );

  const renderCurrentView = () => {
    // Convert to lowercase to prevent capitalization mismatches causing "Page not found"
    switch (currentView.toLowerCase()) {
      case 'login':
        return (
          <Login 
            onLoginSuccess={() => setCurrentView('dashboard')} 
            onSwitchToRegister={() => setCurrentView('register')} 
            onSwitchToForgot={() => setCurrentView('forgot')}
          />
        );
      case 'register':
        return (
          <Register 
            onRegisterSuccess={() => setCurrentView('login')} 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        );
      case 'forgot':
        return (
          <ForgotPassword 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        );
      case 'profile':
        return (
          <Profile 
            theme={theme} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );  
      case 'team':
        return (                      
          <Team
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            theme={theme} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            tasks={dashboardTasks}
            onTasksChange={setDashboardTasks}
          />
        );
      case 'project-overview':
        return <ProjectOverview theme={theme} onNavigate={handleNavigate} />;
      case 'board':
        return <Board boardId={selectedBoardId} />;
      case 'tasks':
        return (
          <Tasks 
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            localNotifications={localNotifications}
            onLocalNotificationsChange={setLocalNotifications}
          />
        );
      case 'newtask':
        return (
          <NewTask
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onCreateTask={handleTaskCreated}
          />
        );
      case 'schedule':
        return (
          <Schedule 
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            selectedDate={selectedDate}
          />
        );
      case 'calendarpage':
        return (
          <CalendarPage
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            selectedDate={selectedDate}
          />
        );
      case 'setting':
        return (
          <Setting
            theme={theme}
            setTheme={setTheme}
            selectedDate={selectedDate}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'upcomingtask':
        return (
          <Upcomingtask
            theme={theme}       
            setTheme={setTheme} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'activity-history':
        return (
          <ActivityHistory
            theme={theme}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
      );
      default:
        return (
          <div style={{ padding: '40px', fontFamily: 'sans-serif', background: theme === 'dark' ? '#0f172a' : '#f8fafc', color: theme === 'dark' ? '#f8fafc' : '#0f172a', minHeight: '100vh' }}>
            <h2>Page not found: "{currentView}"</h2>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{ padding: '8px 16px', background: '#4F5D55', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  const isAuthView = ['login', 'register', 'forgot'].includes(currentView.toLowerCase());

  return (
    <div className="app-root">
      {isAuthView ? renderCurrentView() : (
        <div className={`app-shell app-shell--${theme}`}>
          <Sidebar currentView={currentView.toLowerCase()} theme={theme} onNavigate={handleNavigate} onLogout={handleLogout} />
          <div className="app-shell__page">{renderCurrentView()}</div>
        </div>
      )}
    </div>
  );
}
