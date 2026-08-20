// src/components/ForgotPassword.jsx
import React, { useState } from 'react';

export default function ForgotPassword({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password reset logic or API call here
    setSubmitted(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Left Side Branding (Matching Login Page) */}
        <div className="auth-left">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '40px' }}>
              <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
            </div>
            
            <h2 style={{ fontSize: '28px', color: '#1e293b', lineHeight: '1.2', margin: '0 0 10px 0' }}>
              Plan. Collaborate. <br />
              <span style={{ color: '#2563eb' }}>Get things done.</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', maxWidth: '320px' }}>
              CollabBoard helps your team stay organized, focused and in sync - anytime, anywhere.
            </p>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <div>
              <strong>JWT Authentication</strong><br />
              Secure login and protected routes for your data.
            </div>
            <div>
              <strong>Real-time Updates</strong><br />
              See changes instantly with WebSocket real-time sync.
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <h2 style={{ fontSize: '24px', color: '#1e293b', margin: '0 0 8px 0' }}>Forgot Password? 🔑</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {submitted ? (
            <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '14px', marginBottom: '20px' }}>
              Reset link sent! Please check your email inbox for further instructions.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
              >
                Send Reset Instructions
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            Remember your password?{' '}
            <span 
              onClick={onSwitchToLogin} 
              style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
            >
              Back to Login
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}