// src/components/Login.jsx
import React, { useState } from 'react';

export default function Login({ onSwitchToRegister, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For Milestone 1 skeleton, bypass real auth and trigger success
    onLoginSuccess();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side Branding */}
        <div className="auth-left">
          <div>
            <h3>📅 CollabBoard</h3>
            <h2>Plan. Collaborate.<br /><span style={{ color: '#2563eb' }}>Get things done.</span></h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              CollabBoard helps your team stay organized, focused, and in sync - anytime, anywhere.
            </p>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '15px' }}>
            <span>🔒 JWT Authentication</span>
            <span>⚡ Real-time Updates</span>
            <span>☁️ Offline Support</span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <h2>Welcome back! 👋</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Log in to your CollabBoard Account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Username</label>
              <input 
                type="text" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
            >
              Log in →
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Don't have an account?{' '}
            <span 
              onClick={onSwitchToRegister} 
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}