// src/components/Notifications.jsx
import React, { useState } from 'react';

export default function Notifications({ onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: '#1e293b' }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div onClick={() => onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            📊 Dashboard
          </div>

          <div onClick={() => onNavigate('profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            👤 Profile
          </div>

          <div onClick={() => onNavigate('Tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            📋 Tasks
          </div>
          
          <div onClick={() => onNavigate('team')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            👥 Team
          </div>
          
          <div onClick={() => onNavigate('project-overview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            📁 Project Overview
          </div>
          
          <div onClick={() => onNavigate('setting')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            ⚙️ Setting
          </div>

        </div>

        <button 
          onClick={onLogout}
          style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Header Title */}
        <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#1e293b', fontWeight: 'bold' }}>Notifications</h1>

        {/* Tabs & Mark All as Read Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
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
                  color: activeTab === tab ? '#2563eb' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none'
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: '500', paddingBottom: '12px' }}>
            Mark all as read
          </span>
        </div>

        {/* Notifications List Container */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="Sadula" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <strong>Sadula Adheesha</strong> mentioned you in a comment
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  @nadeeja Please review the upload design.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>2m ago</div>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100" alt="Dinura" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <strong>Dinura Abhishek</strong> assigned you a task
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Design homepage.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>15m ago</div>
          </div>

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold' }}>
                ✓
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <strong>Sithum Rakshitha</strong> moved a task to Done
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Setup database.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>1h ago</div>
          </div>

          {/* Item 4 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Shanaya" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <strong>Shanaya Geevindi</strong> Commented on a task
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Great work! Just a few minor changes.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>2h ago</div>
          </div>

          {/* Item 5 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                🔒
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <strong>System</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Your password was changed successfully.
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>yesterday</div>
          </div>

        </div>

      </div>
    </div>
  );
}