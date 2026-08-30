// src/components/Setting.jsx
import React, { useEffect, useState } from 'react';
import { changePassword, getCurrentUser } from '../services/api';

export default function Setting({ onLogout, onNavigate, theme = 'light', setTheme, selectedDate = '20 August 2026' }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  
  // Other settings toggles state
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('collabUser') || 'null');
      if (savedUser?.email) setAccountEmail(savedUser.email);
    } catch {
      localStorage.removeItem('collabUser');
    }

    getCurrentUser()
      .then(({ data }) => {
        setAccountEmail(data.email || '');
        localStorage.setItem('collabUser', JSON.stringify(data));
      })
      .catch(() => {
        // The saved profile, if available, is enough to render the account card.
      });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    try {
      setIsUpdatingPassword(true);
      const { data } = await changePassword({ currentPassword, newPassword });
      setPasswordMessage(data.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage(err.response?.data?.error || err.response?.data?.message || 'Unable to update your password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bgColor, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      
      {/* Sidebar */}
      <div data-legacy-sidebar style={{ width: '240px', background: cardBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: textColor }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div onClick={() => onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📊 Dashboard
          </div>
          <div onClick={() => onNavigate('profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👤 Profile
          </div>
          <div onClick={() => onNavigate('tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📋 Tasks
          </div>
          <div onClick={() => onNavigate('team')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👥 Team
          </div>
          <div onClick={() => onNavigate('project-overview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📁 Project Overview
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
            ⚙️ Setting
          </div>
        </div>

        <button 
          onClick={onLogout}
          style={{ padding: '10px', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '36px 48px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: textColor }}>Settings</h1>
            <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>Manage your account settings and preferences.</p>
          </div>
          
          {/* Date Badge */}
          <div
            onClick={() => onNavigate('calendarpage')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: textColor,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}
          >
            <span>{selectedDate}</span>
            <span>📅</span>
          </div>
        </div>

        {/* Top Grid: Change Password (Left) & Right Column (Google Account + Appearance) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Change Password Card */}
          <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: textColor }}>Change Password</h3>
                <p style={{ margin: 0, fontSize: '12px', color: subTextColor }}>Update your password to keep your account secure.</p>
              </div>
              <span style={{ fontSize: '18px', background: isDark ? '#1e3a8a' : '#eff6ff', padding: '8px', borderRadius: '8px' }}>🔒</span>
            </div>

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {passwordMessage && (
                <p role="status" style={{ margin: 0, fontSize: '12px', color: passwordMessage === 'Password updated successfully.' ? '#16a34a' : '#dc2626' }}>
                  {passwordMessage}
                </p>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password" 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor, boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isUpdatingPassword}
                style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '6px' }}
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>

            </form>

          </div>

          {/* Right Column (Account & Appearance Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Account Card */}
            <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: textColor }}>Account</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: subTextColor }}>Manage your account details.</p>
                </div>
                <span style={{ fontSize: '18px' }}>🌐</span>
              </div>

              <div style={{ background: isDark ? '#0f172a' : '#f8fafc', padding: '14px', borderRadius: '8px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', background: borderColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: subTextColor }}>
                    {(accountEmail.charAt(0) || '?').toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>{accountEmail || 'Email not available'}</div>
                    <div style={{ fontSize: '11px', color: subTextColor }}>Signed in</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Card */}
            <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: textColor }}>Appearance</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: subTextColor }}>Customize the appearance of the application.</p>
                </div>
                <span style={{ fontSize: '18px' }}>🎨</span>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>Theme Mode</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div 
                  onClick={() => setTheme('light')}
                  style={{ padding: '14px', borderRadius: '8px', border: theme === 'light' ? '2px solid #2563eb' : `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: textColor }}>
                    ☀️ Light Mode
                  </div>
                  <input type="radio" checked={theme === 'light'} readOnly />
                </div>

                <div 
                  onClick={() => setTheme('dark')}
                  style={{ padding: '14px', borderRadius: '8px', border: theme === 'dark' ? '2px solid #2563eb' : `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: textColor }}>
                    🌙 Dark Mode
                  </div>
                  <input type="radio" checked={theme === 'dark'} readOnly />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Enable Dark Mode</div>
                  <div style={{ fontSize: '11px', color: subTextColor }}>Turn on dark mode for a better viewing experience in low light.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={theme === 'dark'} 
                  onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Section: Other Settings Card */}
        <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: textColor }}>Other Settings</h3>
              <p style={{ margin: 0, fontSize: '12px', color: subTextColor }}>Manage other preferences and configurations.</p>
            </div>
            <span style={{ fontSize: '18px' }}>⚙️</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: isDark ? '#1e3a8a' : '#eff6ff', color: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🔔
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Email Notifications</div>
                <div style={{ fontSize: '11px', color: subTextColor }}>Receive email notifications for important updates.</div>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={emailNotifications} 
              onChange={() => setEmailNotifications(!emailNotifications)} 
              style={{ width: '40px', height: '20px', cursor: 'pointer' }}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
