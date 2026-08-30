// src/components/Schedule.jsx
import React from 'react';

export default function Schedule({ onLogout, onNavigate, selectedDate = '20 August 2026', theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  // Timeline events data matching the design
  const timelineEvents = [
    { time: '09:00 AM', title: 'Team Standup', subtitle: 'Daily sync with the team', type: 'Meeting', statusBg: isDark ? '#3b0764' : '#f3e8ff', statusColor: isDark ? '#d8b4fe' : '#7e22ce', icon: '📅' },
    { time: '10:30 AM', title: 'Design dashboard UI', subtitle: 'Project: CollabBoard', type: 'In Progress', statusBg: isDark ? '#082f49' : '#e0f2fe', statusColor: isDark ? '#7dd3fc' : '#0369a1', icon: '💻' },
    { time: '01:00 PM', title: 'API integration', subtitle: 'Project: CollabBoard', type: 'In Progress', statusBg: isDark ? '#082f49' : '#e0f2fe', statusColor: isDark ? '#7dd3fc' : '#0369a1', icon: '⚡' },
    { time: '03:00 PM', title: 'User testing', subtitle: 'Project: CollabBoard', type: 'Completed', statusBg: isDark ? '#052e16' : '#dcfce7', statusColor: isDark ? '#86efac' : '#15803d', icon: '✅' },
    { time: '04:30 PM', title: 'Client Review Meeting', subtitle: 'Review project progress', type: 'Meeting', statusBg: isDark ? '#3b0764' : '#f3e8ff', statusColor: isDark ? '#d8b4fe' : '#7e22ce', icon: '📅' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bgColor, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>

      {/* Sidebar */}
      <div data-legacy-sidebar style={{ width: '240px', background: cardBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: textColor }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📋</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div onClick={() => onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📊 Dashboard
          </div>
          <div onClick={() => onNavigate('profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👤 Profile
          </div>
          <div onClick={() => onNavigate('tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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
      <div style={{ flex: 1, padding: '36px 48px', boxSizing: 'border-box', overflowY: 'auto' }}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 'bold', color: textColor }}>Schedule for {selectedDate}</h1>
            <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>Overview of your tasks and meetings for {selectedDate}.</p>
          </div>

          {/* Date Picker Button badge showing selected date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: cardBg, border: `1px solid ${borderColor}`, padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: textColor, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <span>{selectedDate}</span>
            <span>📅</span>
          </div>
        </div>

        {/* Top Statistics Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>

          <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: subTextColor }}>
              <span style={{ background: isDark ? '#1e3a8a' : '#eff6ff', color: '#2563eb', padding: '4px', borderRadius: '6px' }}>📋</span> Total Tasks
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>8</div>
          </div>

          <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: subTextColor }}>
              <span style={{ background: isDark ? '#14532d' : '#f0fdf4', color: '#16a34a', padding: '4px', borderRadius: '6px' }}>✅</span> Completed
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>3</div>
          </div>

          <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: subTextColor }}>
              <span style={{ background: isDark ? '#082f49' : '#e0f2fe', color: '#0284c7', padding: '4px', borderRadius: '6px' }}>🔄</span> In Progress
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>4</div>
          </div>

          <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: subTextColor }}>
              <span style={{ background: isDark ? '#3b0764' : '#f3e8ff', color: '#9333ea', padding: '4px', borderRadius: '6px' }}>📅</span> Meetings
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: textColor }}>2</div>
          </div>

        </div>

        {/* Timeline Section Title */}
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: textColor, marginBottom: '20px' }}>Timeline for {selectedDate}</h3>

        {/* Timeline Container */}
        <div style={{ position: 'relative', paddingLeft: '90px' }}>

          <div style={{ position: 'absolute', left: '72px', top: '10px', bottom: '10px', width: '2px', background: borderColor }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {timelineEvents.map((evt, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>

                <span style={{ position: 'absolute', left: '-90px', fontSize: '12px', fontWeight: 'bold', color: subTextColor, width: '65px', textAlign: 'right' }}>
                  {evt.time}
                </span>

                <div style={{ position: 'absolute', left: '-20px', width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', border: `2px solid ${cardBg}`, boxShadow: '0 0 0 2px #2563eb' }}></div>

                <div style={{ flex: 1, background: cardBg, padding: '16px 20px', borderRadius: '10px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${borderColor}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      {evt.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '2px' }}>{evt.title}</div>
                      <div style={{ fontSize: '12px', color: subTextColor }}>{evt.subtitle}</div>
                    </div>
                  </div>

                  <span style={{ background: evt.statusBg, color: evt.statusColor, padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    {evt.type}
                  </span>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
