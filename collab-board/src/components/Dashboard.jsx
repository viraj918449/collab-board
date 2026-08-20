// src/components/Dashboard.jsx
import React, { useState } from 'react';

export default function Dashboard({ onLogout, onNavigate }) {
  // State to manage whether the notification dropdown is open or closed
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: '#1e293b' }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
            📊 Dashboard
          </div>

          <div onClick={() => onNavigate('profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            👤 Profile
          </div>
          
          <div onClick={() => onNavigate('tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            📋 Tasks
          </div>
          
          <div onClick={() => onNavigate('team')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
            👥 Team
          </div>
          
          <div onClick={() => onNavigate('ProjectOverview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#64748b', borderRadius: '8px', cursor: 'pointer' }}>
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

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
          <div style={{ position: 'relative', width: '380px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search tasks, boards, or team members..." 
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', background: '#fff' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}>
              + New Task
            </button>

            {/* Notification Bell with Toggle & Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ fontSize: '18px', cursor: 'pointer', padding: '6px', borderRadius: '50%', background: showNotifications ? '#f1f5f9' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                🔔
              </div>

              {showNotifications && (
                <div style={{ position: 'absolute', right: 0, top: '40px', width: '300px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 100, padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>Notifications</span>
                    <span style={{ fontSize: '11px', color: '#2563eb', cursor: 'pointer' }}>Mark all as read</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#475569' }}>
                    <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                      <strong>Nimali</strong> mentioned you in <i>Design Login Page</i> <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>5m ago</div>
                    </div>
                    <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                      <strong>Hasidu</strong> completed task <i>API Integration</i> <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>25m ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: '#cbd5e1' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#1e293b', fontWeight: 'bold' }}>Welcome back, 👋</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Here's what's happening with your projects today.</p>
        </div>

        {/* Main Dashboard Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          
          {/* Left Column: Stats & Task Overviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Tasks</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>24</div>
                <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>+6 from last week</div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>In Progress</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>8</div>
                <div style={{ fontSize: '11px', color: '#ca8a04', marginTop: '4px' }}>+2 from last week</div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Completed</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>10</div>
                <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>+4 from last week</div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Team Members</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b' }}>5</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Active this week</div>
              </div>
            </div>

            {/* Middle Section: Task Overview & Upcoming Tasks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              {/* Tasks Overview Card */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b' }}>Tasks Overview</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '13px' }}>
                  [ Chart Graphic Area ]
                </div>
              </div>

              {/* Upcoming Tasks Card */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Upcoming Tasks</h3>
                  <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>View all</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>☑️ User Roles & Permissions</span>
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>High</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>☑️ Responsive Dashboard</span>
                    <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>Medium</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>☑️ Email Notifications</span>
                    <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>Medium</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Activity Section */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Recent Activity</h3>
                <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>View all</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569' }}>
                <div>🚀 <strong>Nimali</strong> moved 'Design Login Page' to In Progress <i>2m ago</i></div>
                <div>⚡ <strong>Hasidu</strong> completed 'API Integration' <i>10m ago</i></div>
              </div>
            </div>

          </div>

          {/* Right Column: Calendar & Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Calendar Widget */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Calendar</h3>
                <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>August 2026</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                <span>28</span><span>29</span><span>30</span><span>31</span><span>1</span><span>2</span><span>3</span>
                <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                <span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span>
                <span>18</span><span>19</span><span style={{ background: '#2563eb', color: 'white', borderRadius: '50%' }}>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
              </div>
            </div>

            {/* Today's Schedule */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Today's Schedule</h3>
                <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div><strong>10:00 AM</strong> - Sprint Planning</div>
                <div><strong>12:00 PM</strong> - Design Landing Page</div>
                <div><strong>02:00 PM</strong> - Travel App Telemetry</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}