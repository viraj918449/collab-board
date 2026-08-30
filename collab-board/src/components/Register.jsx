// src/components/Register.jsx
import React, { useState } from 'react';
import { registerUser } from '../services/api';

export default function Register({ onSwitchToLogin, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        email,
        password,
        name: fullName,
        role
      });

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess();
      }, 2000);
    } catch (err) {
      console.error('Axios error:', err);
      setLoading(false);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: '850px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Left Side Branding & Features */}
        <div style={{ flex: 1, padding: '40px', background: '#f1f5f9', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: '#0f172a', margin: '0 0 20px 0' }}>📅 CollabBoard</h3>
            <h2 style={{ color: '#0f172a', fontSize: '28px', margin: '0 0 10px 0' }}>Create <span style={{ color: '#4F5D55' }}>your account</span></h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '10px', lineHeight: '1.5' }}>
              Join CollabBoard and start collaborating with your teams.
            </p>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>👥 <strong style={{ color: '#334155' }}>Team Collaboration:</strong> Work together in real-time</div>
            <div>🛡️ <strong style={{ color: '#334155' }}>Secure & Reliable:</strong> Your data is safe always</div>
            <div>☁️ <strong style={{ color: '#334155' }}>Access Anywhere:</strong> Use from any device</div>
          </div>
        </div>

        {/* Right Side Form */}
        <div style={{ flex: 1, padding: '40px' }}>
          <h2 style={{ color: '#0f172a', margin: '0 0 8px 0' }}>Create your account</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Let's get you started with CollabBoard
          </p>

          {/* Inline Error & Success Messages */}
          {error && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', fontSize: '13px', border: '1px solid #f87171' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '8px', fontSize: '13px', border: '1px solid #86efac' }}>
              Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#334155', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', color: '#0f172a', borderRadius: '8px', border: '1px solid #cbd5e1', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#334155', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', color: '#0f172a', borderRadius: '8px', border: '1px solid #cbd5e1', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#334155', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Password</label>
              <input 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', color: '#0f172a', borderRadius: '8px', border: '1px solid #cbd5e1', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#334155', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', color: '#0f172a', borderRadius: '8px', border: '1px solid #cbd5e1', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: '#334155', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Role</label>
              <input 
                type="text" 
                placeholder="e.g. Developer, Project Manager" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', color: '#0f172a', borderRadius: '8px', border: '1px solid #cbd5e1', outlineColor: '#4F5D55', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (loading || success) ? 'not-allowed' : 'pointer', opacity: (loading || success) ? 0.7 : 1, transition: 'background 0.2s' }}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
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
