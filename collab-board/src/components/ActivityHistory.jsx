// src/components/ActivityHistory.jsx
import React, { useState } from 'react';

export default function ActivityHistory({ onNavigate, onLogout, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const mainBg = isDark ? '#0f172a' : '#f8fafc';
  const sidebarBg = isDark ? '#1e293b' : '#f8fafc'; 
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#ffffff';

  // SVG Icons for Actions
  const icons = {
    move: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
    add: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
    edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
    check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
    comment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"/></svg>,
    userAdd: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
    calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
  };

  // Helper component for Sidebar Links
  const NavLink = ({ label, icon, active, route }) => (
    <div 
      onClick={() => onNavigate(route)} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '10px 16px', 
        background: active ? '#2563eb' : 'transparent', 
        color: active ? '#ffffff' : (isDark ? '#cbd5e1' : '#475569'), 
        border: 'none',
        borderRadius: '8px', 
        fontWeight: active ? '500' : 'normal',
        cursor: 'pointer',
        marginBottom: '4px'
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span> 
      <span style={{ fontSize: '14px' }}>{label}</span>
    </div>
  );

  // Mock Data for Activities
  const todayActivities = [
    { id: 1, user: 'Alex Smith', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', actionText: 'moved task "Design dashboard UI" to', highlightText: 'In Progress', isBlue: true, isBold: false, project: 'CollabBoard', time: '2m ago', icon: icons.move, iconColor: '#3b82f6', iconBg: isDark ? '#1e3a8a' : '#eff6ff' },
    { id: 2, user: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', actionText: 'created a new task "User testing"', highlightText: '', project: 'CollabBoard', time: '15m ago', icon: icons.add, iconColor: '#3b82f6', iconBg: isDark ? '#1e3a8a' : '#eff6ff' },
    { id: 3, user: 'Sam Wilson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', actionText: 'updated task "API Integration"', highlightText: '', project: 'CollabBoard', time: '1h ago', icon: icons.edit, iconColor: '#475569', iconBg: isDark ? '#334155' : '#f1f5f9' },
    { id: 4, user: 'Taylor Brown', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', actionText: 'completed task "Client Review Meeting"', highlightText: '', project: 'CollabBoard', time: '2h ago', icon: icons.check, iconColor: '#16a34a', iconBg: isDark ? '#14532d' : '#dcfce7' },
  ];

  const yesterdayActivities = [
    { id: 5, user: 'Emily Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', actionText: 'commented on task "Content Update"', highlightText: '', project: 'CollabBoard', time: 'Yesterday, 4:30 PM', icon: icons.comment, iconColor: '#3b82f6', iconBg: isDark ? '#1e3a8a' : '#eff6ff' },
    { id: 6, user: 'Alex Smith', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', actionText: 'deleted task "Old landing page design"', highlightText: '', project: 'CollabBoard', time: 'Yesterday, 2:15 PM', icon: icons.trash, iconColor: '#ef4444', iconBg: isDark ? '#7f1d1d' : '#fee2e2' },
    { id: 7, user: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', actionText: 'added', highlightText: 'David Brown', isBlue: false, isBold: true, postfixText: 'to the project', project: 'CollabBoard', time: 'Yesterday, 11:20 AM', icon: icons.userAdd, iconColor: '#3b82f6', iconBg: isDark ? '#1e3a8a' : '#eff6ff' },
    { id: 8, user: 'Sam Wilson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', actionText: 'scheduled a meeting "Team Sync-up"', highlightText: '', project: 'CollabBoard', time: 'Yesterday, 10:00 AM', icon: icons.calendar, iconColor: '#3b82f6', iconBg: isDark ? '#1e3a8a' : '#eff6ff' },
    { id: 9, user: 'Taylor Brown', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', actionText: 'uploaded a file "Requirements.docx"', highlightText: '', project: 'CollabBoard', time: 'Yesterday, 9:15 AM', icon: icons.file, iconColor: '#475569', iconBg: isDark ? '#334155' : '#f1f5f9' },
  ];

  // Helper component to render an activity row
  const ActivityRow = ({ data }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${borderColor}` }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        
        {/* Action Icon Badge */}
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: data.iconBg, color: data.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {data.icon}
        </div>

        {/* User Avatar */}
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <img src={data.avatar} alt={data.user} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Action Text */}
        <div>
          <div style={{ fontSize: '14px', color: textColor }}>
            <strong>{data.user}</strong> {data.actionText} 
            {data.highlightText && (
              <span style={{ 
                color: data.isBlue ? '#2563eb' : textColor, 
                fontWeight: data.isBold ? 'bold' : 'normal',
                marginLeft: '4px' 
              }}>
                {data.highlightText}
              </span>
            )}
            {data.postfixText && <span style={{ marginLeft: '4px' }}>{data.postfixText}</span>}
          </div>
          <div style={{ fontSize: '12px', color: subTextColor, marginTop: '4px' }}>
            Project: {data.project}
          </div>
        </div>
      </div>
      
      {/* Timestamp */}
      <div style={{ fontSize: '12px', color: subTextColor, whiteSpace: 'nowrap', paddingTop: '10px' }}>
        {data.time}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: mainBg, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      
      {/* Sidebar - Cleaned up to properly use NavLinks */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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

        {/* Optional Logout Button */}
        <button 
          onClick={onLogout}
          style={{ marginTop: 'auto', padding: '10px', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '32px 48px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Header Title & Date Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: textColor }}>Activity History</h1>
            <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>Track all the important actions across your tasks and projects.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: cardBg, border: `1px solid ${borderColor}`, padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#2563eb' }}>
            18 May 2025 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>

        {/* Controls Row: Filters and Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor, fontSize: '13px', width: '150px', cursor: 'pointer' }}>
              <option>All Boards</option>
            </select>
            <select style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor, fontSize: '13px', width: '150px', cursor: 'pointer' }}>
              <option>All Users</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: subTextColor, display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search activity..." 
                style={{ padding: '10px 12px 10px 36px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor, fontSize: '13px', width: '220px' }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', fontWeight: '500', color: textColor, cursor: 'pointer', fontSize: '13px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
          </div>
        </div>

        {/* Activity List Card */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', overflow: 'hidden' }}>
          
          <h3 style={{ margin: 0, padding: '24px 24px 8px 24px', fontSize: '14px', fontWeight: 'bold', color: textColor }}>Today</h3>
          {todayActivities.map((activity) => (
            <ActivityRow key={activity.id} data={activity} />
          ))}

          <h3 style={{ margin: 0, padding: '24px 24px 8px 24px', fontSize: '14px', fontWeight: 'bold', color: textColor }}>Yesterday</h3>
          {yesterdayActivities.map((activity) => (
            <ActivityRow key={activity.id} data={activity} />
          ))}

          {/* Pagination Section */}
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <button style={{ padding: '6px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '6px', color: subTextColor, cursor: 'pointer' }}>&lt;</button>
            <button style={{ padding: '6px 12px', background: '#2563eb', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>1</button>
            <button style={{ padding: '6px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '6px', color: textColor, cursor: 'pointer' }}>2</button>
            <button style={{ padding: '6px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '6px', color: textColor, cursor: 'pointer' }}>3</button>
            <span style={{ color: subTextColor, padding: '0 4px' }}>...</span>
            <button style={{ padding: '6px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '6px', color: textColor, cursor: 'pointer' }}>8</button>
            <button style={{ padding: '6px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '6px', color: subTextColor, cursor: 'pointer' }}>&gt;</button>
          </div>

        </div>

      </div>
    </div>
  );
}