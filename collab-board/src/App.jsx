// src/App.jsx

import React, { useState } from 'react';
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
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('token') ? 'dashboard' : 'login');
  const [selectedDate, setSelectedDate] = useState('20 August 2026');
  const [theme, setTheme] = useState('light'); // <-- Added theme state for Light/Dark mode

  // Updated navigation handler to accept an optional second argument for the date payload
  const handleNavigate = (view, date = null) => {
    if (date) {
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
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate}
          />
        );  
      case 'team':
        return (                      
          <Team
            theme={theme}
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            theme={theme} 
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate}
          />
        );
      case 'project-overview':
        return (
          <Board />
        );
      case 'board':
        return <Board />;
      case 'tasks':
        return (
          <Tasks 
            theme={theme}
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            theme={theme}
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'newtask':
        return <Board />;
      case 'schedule':
        return (
          <Schedule 
            theme={theme}
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
            selectedDate={selectedDate}
          />
        );
      case 'calendarpage':
        return (
          <CalendarPage
            theme={theme}
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'setting':
        return (
          <Setting
            theme={theme}       
            setTheme={setTheme} 
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'upcomingtask':
        return (
          <Upcomingtask
            theme={theme}       
            setTheme={setTheme} 
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'activity-history':
        return (
          <ActivityHistory
            theme={theme}
            onLogout={() => setCurrentView('login')}
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

  return (
    <div className="app-root">
      {renderCurrentView()}
    </div>
  );
}
