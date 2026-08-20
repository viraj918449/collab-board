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
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [selectedDate, setSelectedDate] = useState('18 May 2025'); // <-- New feature: state for the selected date

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
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate}
          />
        );
      case 'project-overview':
        return (
          <ProjectOverview 
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'tasks':
        return (
          <Tasks 
            onLogout={() => setCurrentView('login')} 
            onNavigate={handleNavigate}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'newtask':
        return (
          <NewTask 
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
          />
        );
      case 'schedule':
        return (
          <Schedule 
            onLogout={() => setCurrentView('login')}
            onNavigate={handleNavigate}
            selectedDate={selectedDate} // <-- New feature: passes date down to Schedule
          />
        );
      case 'calendarpage':
        return (
          <CalendarPage
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