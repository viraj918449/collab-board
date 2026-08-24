// src/components/Register.jsx
import React, { useState } from 'react';

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  
  // Added state for clean UI error/success handling instead of window.alert
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      // Connecting to your Node.js / Express backend route
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Updated payload to match your Express controller expectations
        body: JSON.stringify({ email, password, fullName, role })
      });
      
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Wait 2 seconds so the user can read the success message before redirecting
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Ensure your backend server is running on port 5000.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#000000', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '850px', background: '#111111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
        
        {/* Left Side Branding & Features */}
        <div style={{ flex: 1, padding: '40px', background: '#0a0a0a', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: '#fff', margin: '0 0 20px 0' }}>📅 CollabBoard</h3>
            <h2 style={{ color: '#fff', fontSize: '28px', margin: '0 0 10px 0' }}>Create <span style={{ color: '#4F5D55' }}>your account</span></h2>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '10px', lineHeight: '1.5' }}>
              Join CollabBoard and start collaborating with your teams.
            </p>
          </div>
          <div style={{ fontSize: '13px', color: '#888', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>👥 <strong style={{ color: '#ccc' }}>Team Collaboration:</strong> Work together in real-time</div>
            <div>🛡️ <strong style={{ color: '#ccc' }}>Secure & Reliable:</strong> Your data is safe always</div>
            <div>☁️ <strong style={{ color: '#ccc' }}>Access Anywhere:</strong> Use from any device</div>
          </div>
        </div>

        {/* Right Side Form */}
        <div style={{ flex: 1, padding: '40px' }}>
          <h2 style={{ color: '#fff', margin: '0 0 8px 0' }}>Create your account</h2>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
            Let's get you started with CollabBoard
          </p>

          {/* Inline Error & Success Messages */}
          {error && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', borderRadius: '8px', fontSize: '13px', border: '1px solid #ff4444' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#4ade80', borderRadius: '8px', fontSize: '13px', border: '1px solid #16a34a' }}>
              Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#ccc', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#000000', color: '#fff', borderRadius: '8px', border: '1px solid #333', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#ccc', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#000000', color: '#fff', borderRadius: '8px', border: '1px solid #333', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#ccc', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Password</label>
              <input 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#000000', color: '#fff', borderRadius: '8px', border: '1px solid #333', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#ccc', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#000000', color: '#fff', borderRadius: '8px', border: '1px solid #333', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: '#ccc', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Role</label>
              <input 
                type="text" 
                placeholder="e.g. Developer, Project Manager" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#000000', color: '#fff', borderRadius: '8px', border: '1px solid #333', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={success}
              style={{ width: '100%', padding: '12px', background: '#4F5D55', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: success ? 'not-allowed' : 'pointer', opacity: success ? 0.7 : 1, transition: 'background 0.2s' }}
            >
              Sign Up
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#888' }}>
            Already have an account?{' '}
            <span 
              onClick={onSwitchToLogin} 
              style={{ color: '#4F5D55', cursor: 'pointer', fontWeight: '500' }}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}