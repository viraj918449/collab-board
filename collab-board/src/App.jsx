// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import ProjectOverview from './components/ProjectOverview';
import './App.css';

export default function App() {
  // Controls which component view is currently active
  const [currentView, setCurrentView] = useState('login'); // Starts at login view

  const renderCurrentView = () => {
    switch (currentView) {
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
            onNavigate={(view) => setCurrentView(view)}
          />
        );
      case 'ProjectOverview': // <-- MUST MATCH 'project-overview' passed from the sidebar!
        return (
          <ProjectOverview 
            onLogout={() => setCurrentView('login')}
            onNavigate={(view) => setCurrentView(view)}
          />
        );
      default:
        return (
          <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h2>Page not found</h2>
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