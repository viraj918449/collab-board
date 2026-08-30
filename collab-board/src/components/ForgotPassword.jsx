// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../services/api';

export default function ForgotPassword({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getError = (err, fallback) => err.response?.data?.error || err.response?.data?.message || fallback;

  const handleSendPin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true); setError('');
      const { data } = await requestPasswordReset(email);
      setMessage(data.message);
      setStep('reset');
    } catch (err) { setError(getError(err, 'Unable to send the PIN.')); }
    finally { setLoading(false); }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setLoading(true); setError('');
      const { data } = await resetPassword({ email, pin, newPassword });
      setMessage(data.message);
      setStep('complete');
    } catch (err) { setError(getError(err, 'Unable to reset your password.')); }
    finally { setLoading(false); }
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
          
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <h2 style={{ fontSize: '24px', color: '#1e293b', margin: '0 0 8px 0' }}>Forgot Password? 🔑</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
            {step === 'email' ? 'Enter your email to receive a 4-digit PIN.' : `Enter the PIN sent to ${email}.`}
          </p>
          {message && <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '13px', marginBottom: '16px' }}>{message}</div>}
          {error && <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

          {step === 'email' && (
            <form onSubmit={handleSendPin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
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
                {loading ? 'Sending…' : 'Send 4-Digit PIN'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset}>
              <input inputMode="numeric" pattern="[0-9]{4}" maxLength="4" placeholder="4-digit PIN" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '18px', letterSpacing: '0.35em', textAlign: 'center', marginBottom: '12px' }} required />
              <input type="password" minLength="6" placeholder="New password (at least 6 characters)" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', marginBottom: '12px' }} required />
              <input type="password" minLength="6" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', marginBottom: '20px' }} required />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginBottom: '10px' }}>{loading ? 'Updating…' : 'Update Password'}</button>
              <button type="button" onClick={() => { setStep('email'); setPin(''); setError(''); }} style={{ width: '100%', padding: '8px', color: '#2563eb', border: 'none', background: 'transparent', cursor: 'pointer' }}>Send a new PIN</button>
            </form>
          )}

          {step === 'complete' && <button type="button" onClick={onSwitchToLogin} style={{ width: '100%', padding: '12px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}>Back to Login</button>}

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
