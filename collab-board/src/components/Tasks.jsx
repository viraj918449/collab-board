// src/components/Tasks.jsx
import React, { useState } from 'react';

export default function Tasks({ onLogout, onNavigate, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#f8fafc';

  // Checklist item state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Create Hero section', completed: true },
    { id: 2, text: 'Add features section', completed: true },
    { id: 3, text: 'Design testimonials section', completed: false },
    { id: 4, text: 'Add CTA section', completed: false },
  ]);

  // Task Priority state
  const [priority, setPriority] = useState('High');

  // Comments state
  const [comments, setComments] = useState([
    { id: 1, author: 'Nadishan Vithanarachchi', time: 'May 20, 3:00 PM', text: 'Please check the updated hero section.', avatarBg: '#ef4444' },
    { id: 2, author: 'Imanya Lamahewa', time: 'May 20, 3:00 PM', text: 'I have reviewed it.', avatarBg: '#3b82f6' },
    { id: 3, author: 'Harini Hasara', time: 'May 21, 7:46 PM', text: "Looks good! I'll move to the next section.", avatarBg: '#3b82f6' }
  ]);
  const [newComment, setNewComment] = useState('');

  // Toggle checklist status
  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Handle adding new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: 'You',
      time: 'Just now',
      text: newComment,
      avatarBg: '#10b981'
    };

    setComments([...comments, commentObj]);
    setNewComment('');
  };

  const completedCount = checklist.filter(item => item.completed).length;

  // Helper color map for priority badges - Updated for Dark Mode
  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High':
        return { background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626' };
      case 'Medium':
        return { background: isDark ? '#78350f' : '#fef3c7', color: isDark ? '#fde68a' : '#d97706' };
      case 'Low':
        return { background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569' };
      default:
        return { background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626' };
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

        <button 
          onClick={onLogout}
          style={{ padding: '10px', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', padding: '32px 48px', gap: '60px', boxSizing: 'border-box', overflowY: 'auto', background: cardBg }}>

        {/* Left Column: Title & Metadata */}
        <div style={{ flex: '1', maxWidth: '420px' }}>
          <h1 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 'bold', color: textColor }}>Design homepage</h1>
          <p style={{ margin: '0 0 32px 0', fontSize: '13px', color: subTextColor, lineHeight: '1.5' }}>
            Create the homepage design based on the approved wireframes and brand guidelines.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Assignee</span>
              <span style={{ fontWeight: '500', color: textColor }}>Nadishan Withanarachchi</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Due Date</span>
              <span style={{ color: textColor }}>📅 May 23, 2024</span>
            </div>

            {/* Priority Dropdown Field */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Priority</span>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  ...getPriorityStyle(priority),
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  border: `1px solid ${borderColor}`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Labels</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: isDark ? '#1e3a8a' : '#eff6ff', color: isDark ? '#60a5fa' : '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>Design</span>
                <span style={{ background: isDark ? '#3b0764' : '#f3e8ff', color: isDark ? '#d8b4fe' : '#9333ea', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>UI/UX</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Board</span>
              <span style={{ color: textColor }}>Website Redesign</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Column</span>
              <span style={{ color: '#2563eb', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>In Progress</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Created</span>
              <span style={{ color: subTextColor, fontSize: '12px' }}>May 16, 2024 10:30 AM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: subTextColor }}>Updated</span>
              <span style={{ color: subTextColor, fontSize: '12px' }}>May 21, 2024 03:15 PM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Description, Checklist & Comments */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Description Section */}
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: textColor }}>Description</h3>
            <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: '1.6' }}>
              The homepage should include the hero section, features overview, testimonials, and CTA section. Follow the design system and the Figma mockups.
            </p>
          </div>

          {/* Checklist Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: textColor }}>Checklist</h3>
              <span style={{ fontSize: '12px', color: subTextColor, fontWeight: '500' }}>{completedCount}/{checklist.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {checklist.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleChecklistItem(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: item.completed ? subTextColor : textColor, cursor: 'pointer', userSelect: 'none' }}
                >
                  <input 
                    type="checkbox" 
                    checked={item.completed} 
                    onChange={() => {}} // Handled by parent wrapper click
                    style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }} 
                  />
                  <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: textColor }}>Comments</h3>
              <span style={{ fontSize: '12px', color: subTextColor, fontWeight: '500' }}>{comments.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.avatarBg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>
                    {c.author.charAt(0)}
                  </div>
                  <div style={{ background: inputBg, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>{c.author}</span>
                      <span style={{ fontSize: '10px', color: subTextColor }}>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: '1.4' }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment}>
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', fontSize: '13px', boxSizing: 'border-box', background: inputBg, color: textColor }}
              />
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}