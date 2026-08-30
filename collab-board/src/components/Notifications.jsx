// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../services/api';

const relativeTime = (date) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default function Notifications({ onLogout, onNavigate, localNotifications = [], onLocalNotificationsChange, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#ffffff';

  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(localNotifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchNotifications();
      setNotifications([...localNotifications, ...response.data]);
    } catch (requestError) {
      // Notifications created from the dashboard remain available offline.
      setNotifications(localNotifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const isLocalNotification = (id) => String(id).startsWith('local-');

  const filteredNotifications = notifications.filter((notification) => (
    activeTab === 'Unread' ? !notification.read : activeTab === 'Mentions' ? notification.type === 'mention' : true
  ));

  const markAllAsRead = async () => {
    const unreadServerNotifications = notifications.some((item) => !item.read && !isLocalNotification(item._id));
    try {
      if (unreadServerNotifications) await markAllNotificationsAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      onLocalNotificationsChange?.((items) => items.map((item) => ({ ...item, read: true })));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update notifications.');
    }
  };

  const markAsRead = async (id) => {
    if (notifications.find((item) => item._id === id)?.read) return;
    if (isLocalNotification(id)) {
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
      onLocalNotificationsChange?.((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
      return;
    }
    try {
      await markNotificationAsRead(id);
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update notification.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bgColor, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      
      {/* Sidebar */}
      <div style={{ width: '240px', background: cardBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
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

          <div onClick={() => onNavigate('Tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📋 Tasks
          </div>
          
          <div onClick={() => onNavigate('team')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👥 Team
          </div>
          
          <div onClick={() => onNavigate('project-overview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📁 Project Overview
          </div>
          
          <div onClick={() => onNavigate('setting')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Header Title */}
        <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', color: textColor, fontWeight: 'bold' }}>Notifications</h1>

        {/* Tabs & Mark All as Read Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['All', 'Unread', 'Mentions'].map((tab) => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  paddingBottom: '12px', 
                  cursor: 'pointer', 
                  fontSize: '14px', 
                  fontWeight: activeTab === tab ? '600' : 'normal',
                  color: activeTab === tab ? '#2563eb' : subTextColor,
                  borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none'
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <button type="button" onClick={markAllAsRead} style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: '500', paddingBottom: '12px', border: 'none', background: 'transparent' }}>
            Mark all as read
          </button>
        </div>

        {/* Notifications List Container */}
        <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {loading && <div style={{ padding: '20px', color: subTextColor }}>Loading notifications...</div>}
          {error && <div style={{ padding: '20px', color: '#dc2626' }}>{error}</div>}
          {!loading && !error && filteredNotifications.length === 0 && <div style={{ padding: '20px', color: subTextColor }}>No notifications to show.</div>}
          {!loading && filteredNotifications.map((notification, index) => {
            const actorName = notification.actor?.name || notification.actor?.email || 'System';
            return (
              <button
                type="button"
                key={notification._id}
                onClick={() => markAsRead(notification._id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px', border: 'none', borderBottom: index < filteredNotifications.length - 1 ? `1px solid ${borderColor}` : 'none', background: notification.read ? cardBg : (isDark ? '#25344a' : '#eff6ff'), color: textColor, cursor: notification.read ? 'default' : 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDark ? '#1d4ed8' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' }}>
                    {notification.type === 'task_assigned' ? 'T' : '✓'}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: textColor }}><strong>{actorName}</strong></div>
                    <div style={{ fontSize: '12px', color: subTextColor, marginTop: '2px' }}>{notification.message}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap' }}>{relativeTime(notification.createdAt)}</div>
              </button>
            );
          })}
          {false && <>
          
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="Sadula" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', color: textColor }}>
                  <strong>Sadula Adheesha</strong> mentioned you in a comment
                </div>
                <div style={{ fontSize: '12px', color: subTextColor, marginTop: '2px' }}>
                  @nadeeja Please review the upload design.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap' }}>2m ago</div>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100" alt="Dinura" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', color: textColor }}>
                  <strong>Dinura Abhishek</strong> assigned you a task
                </div>
                <div style={{ fontSize: '12px', color: subTextColor, marginTop: '2px' }}>
                  Design homepage.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap' }}>15m ago</div>
          </div>

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDark ? '#14532d' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold' }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: '14px', color: textColor }}>
                  <strong>Sithum Rakshitha</strong> moved a task to Done
                </div>
                <div style={{ fontSize: '12px', color: subTextColor, marginTop: '2px' }}>
                  Setup database.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap' }}>1h ago</div>
          </div>

          {/* Item 4 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Shanaya" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', color: textColor }}>
                  <strong>Shanaya Geevindi</strong> Commented on a task
                </div>
                <div style={{ fontSize: '12px', color: subTextColor, marginTop: '2px' }}>
                  Great work! Just a few minor changes.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap' }}>2h ago</div>
          </div>

          {/* Item 5 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDark ? '#334155' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subTextColor }}>
                🔒
              </div>
              <div>
                <div style={{ fontSize: '14px', color: textColor }}>
                  <strong>System</strong>
                </div>
                <div style={{ fontSize: '12px', color: subTextColor, marginTop: '2px' }}>
                  Your password was changed successfully.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap' }}>yesterday</div>
          </div>
          </>}
        </div>

      </div>
    </div>
  );
}
