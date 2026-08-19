// src/components/Dashboard.jsx
import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '20px' }}>
        <h3>📅 CollabBoard</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
          <li style={{ padding: '12px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>📊 Dashboard</li>
          <li style={{ padding: '12px', color: '#64748b', cursor: 'pointer', marginBottom: '10px' }}>📋 Tasks</li>
          <li style={{ padding: '12px', color: '#64748b', cursor: 'pointer', marginBottom: '10px' }}>👥 Team</li>
          <li style={{ padding: '12px', color: '#64748b', cursor: 'pointer', marginBottom: '10px' }}>💬 Messages</li>
          <li style={{ padding: '12px', color: '#64748b', cursor: 'pointer' }}>⚙️ Setting</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2>Welcome back, 👋</h2>
            <p style={{ color: '#64748b' }}>Here's what's happening with your projects today.</p>
          </div>
          <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
            + New Task
          </button>
        </div>

        {/* Quick Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Total Tasks</p>
            <h2 style={{ margin: '10px 0 0 0' }}>24</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748b', margin: 0 }}>In Progress</p>
            <h2 style={{ margin: '10px 0 0 0' }}>8</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Completed</p>
            <h2 style={{ margin: '10px 0 0 0' }}>10</h2>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Team Members</p>
            <h2 style={{ margin: '10px 0 0 0' }}>5</h2>
          </div>
        </div>
      </div>
    </div>
  );
}