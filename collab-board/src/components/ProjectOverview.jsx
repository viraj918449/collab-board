// src/components/ProjectOverview.jsx
import React from 'react';

export default function ProjectOverview({ onNavigate, onLogout }) {
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
          <div onClick={() => onNavigate('ProjectOverview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: 'bold' }}>Project Name</h1>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>
              + Invite
            </button>
            <button style={{ padding: '8px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#334155' }}>
              ···
            </button>
          </div>
        </div>

        {/* Sub-header Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search tasks....." 
              style={{ padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '180px', fontSize: '13px' }}
            />
          </div>
          <button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}>
            + Add Task
          </button>
        </div>

        {/* Kanban Board Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
          
          {/* COLUMN 1: To Do */}
          <div style={{ background: '#f4f3ff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>To Do</h3>
            
            <div style={{ background: 'white', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>Create wireframe</div>
              <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>Design</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>May 25</span>
                <span>May 25</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>Research competitors</div>
              <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>Research</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>May 26</span>
                <span>May 26</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            <div style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: '500', padding: '4px 0' }}>
              + Add Task
            </div>
          </div>

          {/* COLUMN 2: In Progress */}
          <div style={{ background: '#fcfaf6', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>In progress</h3>
            
            <div style={{ background: 'white', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>Design homepage</div>
              <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>Design</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>May 23</span>
                <span>May 23</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            <div style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: '500', padding: '4px 0' }}>
              + Add Task
            </div>
          </div>

          {/* COLUMN 3: Done */}
          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>Done</h3>
            
            <div style={{ background: 'white', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', marginBottom: '8px' }}>Project planning</div>
              <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>Planning</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>May 16</span>
                <span>May 16</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            <div style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: '500', padding: '4px 0' }}>
              + Add Task
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}