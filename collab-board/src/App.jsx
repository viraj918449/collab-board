// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import ProjectOverview from './components/ProjectOverview';
import Notifications from './components/Notifications'; 
import Tasks from './components/Tasks';
import NewTask from './components/NewTask'; 
import Schedule from './components/Schedule';
import CalendarPage from './components/CalendarPage';
import Setting from './components/Setting';
import Profile from './components/Profile'; 
import ActivityHistory from './components/ActivityHistory';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [selectedDate, setSelectedDate] = useState('20 August 2026');
  const [theme, setTheme] = useState('light'); // <-- Added theme state for Light/Dark mode

  // Updated navigation handler to accept an optional second argument for the date payload
  const handleNavigate = (view, date = null) => {
    if (date) {
      setSelectedDate(date);
    }
    setCurrentView(view);
  };

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
      case 'dashboard':
        return (
          <Dashboard 
            theme={theme} // <-- Passes theme down to Dashboard
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate}
          />
        );
      case 'project-overview':
        return (
          <ProjectOverview 
            theme={theme}
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
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
        return (
          <NewTask 
            theme={theme}
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
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
            theme={theme}       // <-- Passes theme down to Setting
            setTheme={setTheme} // <-- Passes setTheme down to Setting
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
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
          <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h2>Page not found: "{currentView}"</h2>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}
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