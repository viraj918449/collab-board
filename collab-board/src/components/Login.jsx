// src/components/Login.jsx
import React, { useState } from 'react';

export default function Login({ onSwitchToRegister, onLoginSuccess, onSwitchToForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state for better UX

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Invalid login credentials.');
      }

      // Store token using the key matching your auth middleware/storage expectations
      localStorage.setItem('collabToken', data.token);
      
      // Optional: Store user profile object if returned by backend
      if (data.user) {
        localStorage.setItem('collabUser', JSON.stringify(data.user));
      }

      onLoginSuccess();
      
    } catch (err) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side Branding */}
        <div className="auth-left">
          <div>
            <h3>📅 CollabBoard</h3>
            <h2>Plan. Collaborate.<br /><span style={{ color: '#4F5D55' }}>Get things done.</span></h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              CollabBoard helps your team stay organized, focused, and in sync - anytime, anywhere.
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
          <h2>Welcome back! 👋</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Log in to your CollabBoard Account
          </p>

          {error && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '13px', border: '1px solid #f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
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
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                Remember me
              </label>
              
              <span 
                onClick={onSwitchToForgot} 
                style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '500' }}
              >
                Forgot password?
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Logging in...' : 'Log in →'}
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