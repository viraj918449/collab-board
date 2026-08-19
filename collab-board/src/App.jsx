// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', or 'dashboard'

  return (
    <div className="app-root">
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={() => setCurrentView('dashboard')} 
          onSwitchToRegister={() => setCurrentView('register')} 
        />
      )}

      {currentView === 'register' && (
        <Register 
          onRegisterSuccess={() => setCurrentView('login')} 
          onSwitchToLogin={() => setCurrentView('login')} 
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard 
          onLogout={() => setCurrentView('login')} 
        />
      )}
    </div>
  );
}