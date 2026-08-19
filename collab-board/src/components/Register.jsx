// src/components/Register.jsx
import React, { useState } from 'react';

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // Connecting to your Node.js / Express backend route
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully! Please log in.');
        onRegisterSuccess();
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      // Fallback for frontend-only testing if backend isn't running yet
      onRegisterSuccess();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side Branding & Features */}
        <div className="auth-left">
          <div>
            <h3>📅 CollabBoard</h3>
            <h2>Create <span style={{ color: '#2563eb' }}>your account</span></h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
              Join CollabBoard and start collaborating with your teams.
            </p>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>👥 <strong>Team Collaboration:</strong> Work together in real-time</div>
            <div>🛡️ <strong>Secure & Reliable:</strong> Your data is safe always</div>
            <div>☁️ <strong>Access Anywhere:</strong> Use from any device</div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <h2>Create your account</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '15px' }}>
            Let's get you started with CollabBoard
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '3px' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '3px' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '3px' }}>Password</label>
              <input 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '3px' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '3px' }}>Role</label>
              <input 
                type="text" 
                placeholder="e.g. Developer, Project Manager" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '10px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
            Already have an account?{' '}
            <span 
              onClick={onSwitchToLogin} 
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}