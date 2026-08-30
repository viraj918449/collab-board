// src/components/NewTask.jsx
import React, { useState } from 'react';

export default function NewTask({ onLogout, onNavigate, onCreateTask, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  const [taskTitle, setTaskTitle] = useState('');
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError('Task title is required.');
      return;
    }

    onCreateTask?.({
      id: `local-${Date.now()}`,
      title: taskTitle.trim(),
      project,
      description,
      assignee,
      dueDate,
      priority,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      status: 'Pending',
    });
    onNavigate('dashboard');
  };

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

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 60px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 'bold', color: textColor }}>New Task</h1>
            <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>Create a new task and add details.</p>
          </div>
          <button 
            onClick={() => onNavigate('tasks')}
            style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '6px 14px', borderRadius: '6px', fontSize: '13px', color: textColor, cursor: 'pointer', fontWeight: '500' }}
          >
            &lt; Back to Tasks
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ background: cardBg, padding: '32px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
          {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>{error}</p>}
          
          {/* Task Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Task Title</label>
            <input 
              type="text" 
              placeholder="e.g. Design homepage for website"
              value={taskTitle}
              onChange={(e) => { setTaskTitle(e.target.value); setError(''); }}
              required
              style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor }}
            />
          </div>

          {/* Project Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Project</label>
            <select 
              value={project}
              onChange={(e) => setProject(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: project ? textColor : subTextColor, cursor: 'pointer' }}
            >
              <option value="" disabled>Select project</option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="IoT Monitoring Network">IoT Monitoring Network</option>
            </select>
          </div>

          {/* Task Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Task Description</label>
            <textarea 
              rows="4"
              placeholder="Add task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor, resize: 'vertical' }}
            />
          </div>

          {/* Assign To, Due Date, Priority Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            
            {/* Assign To */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Assign To</label>
              <select 
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: assignee ? textColor : subTextColor, cursor: 'pointer' }}
              >
                <option value="" disabled>Select team member</option>
                <option value="Nadishan Withanarachchi">Nadishan Withanarachchi</option>
                <option value="Imanya Lamahewa">Imanya Lamahewa</option>
                <option value="Harini Hansara">Harini Hansara</option>
              </select>
            </div>

            {/* Due Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Due Date</label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor }}
              />
            </div>

            {/* Priority */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor, fontWeight: '500', cursor: 'pointer' }}
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟠 Medium</option>
                <option value="Low">⚪ Low</option>
              </select>
            </div>

          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: textColor }}>Tags (Optional)</label>
            <input 
              type="text" 
              placeholder="Add tags separated by commas (e.g. design, ui, important)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, fontSize: '13px', outline: 'none', background: inputBg, color: textColor }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => onNavigate('tasks')}
              style={{ padding: '10px 20px', background: cardBg, border: `1px solid ${borderColor}`, color: subTextColor, borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{ padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
            >
              Create Task
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
