// src/components/ProjectOverview.jsx
import React, { useMemo, useState } from 'react';

export default function ProjectOverview({ onNavigate, onLogout, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  // State for tasks in columns
  const [todoTasks, setTodoTasks] = useState([
    { id: 1, title: 'Create wireframe', tag: 'Design', date: 'May 25', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: 2, title: 'Research competitors', tag: 'Research', date: 'May 26', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
  ]);

  const [inProgressTasks, setInProgressTasks] = useState([
    { id: 3, title: 'Design homepage', tag: 'Design', date: 'May 23', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
  ]);

  const [doneTasks, setDoneTasks] = useState([
    { id: 4, title: 'Project planning', tag: 'Planning', date: 'May 16', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' }
  ]);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // New Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Design');
  const [newTaskColumn, setNewTaskColumn] = useState('todo');

  // New Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  const filteredTodoTasks = useMemo(() => {
  return todoTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [todoTasks, searchQuery]);

const filteredInProgressTasks = useMemo(() => {
  return inProgressTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [inProgressTasks, searchQuery]);

const filteredDoneTasks = useMemo(() => {
  return doneTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [doneTasks, searchQuery]);


  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      tag: newTaskTag,
      date: 'Aug 20',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    };

    if (newTaskColumn === 'todo') setTodoTasks([...todoTasks, newTask]);
    if (newTaskColumn === 'inprogress') setInProgressTasks([...inProgressTasks, newTask]);
    if (newTaskColumn === 'done') setDoneTasks([...doneTasks, newTask]);

    setNewTaskTitle('');
    setIsTaskModalOpen(false);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    alert(`Invitation sent successfully to ${inviteEmail}!`);
    setInviteEmail('');
    setIsInviteModalOpen(false);
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
          <div onClick={() => onNavigate('ProjectOverview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: textColor, fontWeight: 'bold' }}>Project Name</h1>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              style={{ padding: '8px 16px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', fontWeight: '500', color: textColor, cursor: 'pointer' }}
            >
              + Invite
            </button>
            <button style={{ padding: '8px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer', color: textColor }}>
              ···
            </button>
          </div>
        </div>

        {/* Sub-header Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: subTextColor }}>🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks....." 
              style={{ padding: '8px 12px 8px 32px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', width: '180px', fontSize: '13px', background: inputBg, color: textColor }}
            />
          </div>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
          >
            + Add Task
          </button>
        </div>

        {/* Kanban Board Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
          
          {/* COLUMN 1: To Do */}
          <div style={{ background: isDark ? '#1e1b4b' : '#f4f3ff', padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: textColor, fontWeight: 'bold' }}>To Do</h3>
            
            {filteredTodoTasks.map(task => (
              <div key={task.id} style={{ background: cardBg, padding: '14px', borderRadius: '10px', border: `1px solid ${borderColor}`, marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, marginBottom: '8px' }}>{task.title}</div>
                <span style={{ background: isDark ? '#312e81' : '#ede9fe', color: isDark ? '#c4b5fd' : '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>{task.tag}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: subTextColor }}>
                  <span>{task.date}</span>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                    <img src={task.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            ))}

            <div 
              onClick={() => { setNewTaskColumn('todo'); setIsTaskModalOpen(true); }}
              style={{ color: subTextColor, fontSize: '13px', cursor: 'pointer', fontWeight: '500', padding: '4px 0' }}
            >
              + Add Task
            </div>
          </div>

          {/* COLUMN 2: In Progress */}
          <div style={{ background: isDark ? '#292524' : '#fcfaf6', padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: textColor, fontWeight: 'bold' }}>In progress</h3>
            
            {filteredInProgressTasks.map(task => (
              <div key={task.id} style={{ background: cardBg, padding: '14px', borderRadius: '10px', border: `1px solid ${borderColor}`, marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, marginBottom: '8px' }}>{task.title}</div>
                <span style={{ background: isDark ? '#312e81' : '#ede9fe', color: isDark ? '#c4b5fd' : '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>{task.tag}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: subTextColor }}>
                  <span>{task.date}</span>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                    <img src={task.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            ))}

            <div 
              onClick={() => { setNewTaskColumn('inprogress'); setIsTaskModalOpen(true); }}
              style={{ color: subTextColor, fontSize: '13px', cursor: 'pointer', fontWeight: '500', padding: '4px 0' }}
            >
              + Add Task
            </div>
          </div>

          {/* COLUMN 3: Done */}
          <div style={{ background: isDark ? '#064e3b' : '#f0fdf4', padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: textColor, fontWeight: 'bold' }}>Done</h3>
            
            {filteredDoneTasks.map(task => (
              <div key={task.id} style={{ background: cardBg, padding: '14px', borderRadius: '10px', border: `1px solid ${borderColor}`, marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, marginBottom: '8px' }}>{task.title}</div>
                <span style={{ background: isDark ? '#14532d' : '#dcfce7', color: isDark ? '#86efac' : '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' }}>{task.tag}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: subTextColor }}>
                  <span>{task.date}</span>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                    <img src={task.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            ))}

            <div 
              onClick={() => { setNewTaskColumn('done'); setIsTaskModalOpen(true); }}
              style={{ color: subTextColor, fontSize: '13px', cursor: 'pointer', fontWeight: '500', padding: '4px 0' }}
            >
              + Add Task
            </div>
          </div>

        </div>
      </div>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: textColor }}>
            <h3 style={{ margin: '0 0 16px 0', color: textColor }}>Add Task to Board</h3>
            <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: subTextColor, marginBottom: '6px' }}>Task Title</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title..." 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', boxSizing: 'border-box', background: inputBg, color: textColor }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: subTextColor, marginBottom: '6px' }}>Tag Category</label>
                <select 
                  value={newTaskTag}
                  onChange={(e) => setNewTaskTag(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor }}
                >
                  <option value="Design">Design</option>
                  <option value="Research">Research</option>
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: subTextColor, marginBottom: '6px' }}>Column</label>
                <select 
                  value={newTaskColumn}
                  onChange={(e) => setNewTaskColumn(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor }}
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsTaskModalOpen(false)}
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

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: textColor }}>
            <h3 style={{ margin: '0 0 16px 0', color: textColor }}>Invite Team Member</h3>
            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: subTextColor, marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com" 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', boxSizing: 'border-box', background: inputBg, color: textColor }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsInviteModalOpen(false)}
                  style={{ padding: '8px 16px', background: isDark ? '#334155' : '#e2e8f0', color: textColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}