// src/components/Dashboard.jsx
import React, { useState } from 'react';

export default function Dashboard({ onLogout, onNavigate, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  // Local state for interactive features
  const [tasks, setTasks] = useState([
    { id: 1, title: 'User Roles & Permissions', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Responsive Dashboard', priority: 'Medium', status: 'Pending' },
    { id: 3, title: 'Email Notifications', priority: 'Medium', status: 'Pending' },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, text: "🚀 Nimali moved 'Design Login Page' to In Progress", time: '2m ago' },
    { id: 2, text: "⚡ Hasidu completed 'API Integration'", time: '10m ago' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      priority: newTaskPriority,
      status: 'Pending',
    };

    setTasks([newTask, ...tasks]);
    setActivities([
      { id: Date.now(), text: `✨ You added a new task '${newTaskTitle}'`, time: 'Just now' },
      ...activities
    ]);

    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  // Toggle task completion
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  // Filter tasks based on search
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bgColor, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      
      {/* Sidebar */}
      <div style={{ width: '240px', background: cardBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: textColor }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', boxSizing: 'border-box', overflowY: 'auto', position: 'relative' }}>
        
        {/* Top Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '380px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: subTextColor }}>🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, boards, or team members..." 
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', fontSize: '13px', background: inputBg, color: textColor, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => onNavigate('newtask')}
              style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
            >
              + New Task
            </button>

            <div 
              onClick={() => onNavigate('notifications')}
              style={{ fontSize: '18px', cursor: 'pointer', padding: '6px', borderRadius: '50%', background: cardBg, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="View Notifications"
            >
              🔔
            </div>

            <div onClick={() => onNavigate('profile')} style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: '#cbd5e1', cursor: 'pointer' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: textColor, fontWeight: 'bold' }}>Welcome back, 👋</h1>
          <p style={{ margin: 0, color: subTextColor, fontSize: '14px' }}>Here's what's happening with your projects today.</p>
        </div>

        {/* Main Dashboard Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          
          {/* Left Column: Stats & Task Overviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ background: cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '12px', color: subTextColor, marginBottom: '4px' }}>Total Tasks</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: textColor }}>{tasks.length + 21}</div>
                <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>+6 from last week</div>
              </div>
              <div style={{ background: cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '12px', color: subTextColor, marginBottom: '4px' }}>In Progress</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: textColor }}>8</div>
                <div style={{ fontSize: '11px', color: '#ca8a04', marginTop: '4px' }}>+2 from last week</div>
              </div>
              <div style={{ background: cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '12px', color: subTextColor, marginBottom: '4px' }}>Completed</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: textColor }}>
                  {tasks.filter(t => t.status === 'Completed').length + 10}
                </div>
                <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>+4 from last week</div>
              </div>
              <div style={{ background: cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '12px', color: subTextColor, marginBottom: '4px' }}>Team Members</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: textColor }}>5</div>
                <div style={{ fontSize: '11px', color: subTextColor, marginTop: '4px' }}>Active this week</div>
              </div>
            </div>

            {/* Middle Section: Task Overview & Upcoming Tasks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              {/* Tasks Overview Card */}
              <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: textColor }}>Tasks Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '160px', background: isDark ? '#0f172a' : '#f8fafc', borderRadius: '8px', border: `1px dashed ${borderColor}`, padding: '16px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: textColor }}>
                    <span>Completed</span>
                    <span style={{ fontWeight: 'bold' }}>65%</span>
                  </div>
                  <div style={{ width: '100%', background: isDark ? '#334155' : '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ width: '65%', background: '#2563eb', height: '100%' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: textColor }}>
                    <span>In Progress</span>
                    <span style={{ fontWeight: 'bold' }}>35%</span>
                  </div>
                  <div style={{ width: '100%', background: isDark ? '#334155' : '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', background: '#ca8a04', height: '100%' }}></div>
                  </div>
                </div>
              </div>

              {/* Upcoming Tasks Card */}
              <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: textColor }}>Upcoming Tasks</h3>
                  <button onClick={() => onNavigate('upcomingtask')} style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: '500' }}>View all</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  {filteredTasks.length === 0 ? (
                    <div style={{ color: subTextColor, textAlign: 'center', padding: '20px 0' }}>No matching tasks found.</div>
                  ) : (
                    filteredTasks.map(task => (
                      <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span 
                          onClick={() => toggleTaskStatus(task.id)} 
                          style={{ cursor: 'pointer', textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? subTextColor : textColor }}
                          title="Click to toggle completion"
                        >
                          {task.status === 'Completed' ? '✅' : '☑️'} {task.title}
                        </span>
                        <span style={{ 
                          background: task.priority === 'High' ? (isDark ? '#7f1d1d' : '#fee2e2') : (isDark ? '#78350f' : '#fef3c7'), 
                          color: task.priority === 'High' ? (isDark ? '#fca5a5' : '#dc2626') : (isDark ? '#fde68a' : '#d97706'), 
                          padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' 
                        }}>
                          {task.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Recent Activity Section */}
            <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: textColor }}>Recent Activity</h3>
                <button onClick={() => onNavigate('activity-history')} style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: '500' }}>View all</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: subTextColor }}>
                {activities.map(act => (
                  <div key={act.id}>
                    {act.text} <i style={{ color: subTextColor, fontSize: '11px' }}>{act.time}</i>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Calendar & Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Calendar Widget */}
            <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: textColor }}>Calendar</h3>
                <button onClick={() => onNavigate('calendarpage')} style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: '500' }}>View All</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '10px' }}>August 2026</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', color: subTextColor }}>
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                <span>28</span><span>29</span><span>30</span><span>31</span><span>1</span><span>2</span><span>3</span>
                <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                <span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span>
                <span>18</span><span>19</span><span style={{ background: '#2563eb', color: 'white', borderRadius: '50%', fontWeight: 'bold' }}>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
              </div>
            </div>

            {/* Today's Schedule */}
            <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: textColor }}>Today's Schedule</h3>
                <button onClick={() => onNavigate('schedule')} style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontWeight: '500' }}>View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: textColor }}>
                <div><strong>10:00 AM</strong> - Sprint Planning</div>
                <div><strong>12:00 PM</strong> - Design Landing Page</div>
                <div><strong>02:00 PM</strong> - Travel App Telemetry</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: textColor }}>
            <h3 style={{ margin: '0 0 16px 0', color: textColor }}>Create New Task</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: subTextColor, marginBottom: '6px' }}>Task Title</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task description..." 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', boxSizing: 'border-box', background: inputBg, color: textColor }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: subTextColor, marginBottom: '6px' }}>Priority</label>
                <select 
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: isDark ? '#334155' : '#e2e8f0', color: textColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}