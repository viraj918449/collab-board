// src/components/Tasks.jsx
import React, { useState } from 'react';

export default function Tasks({ onLogout, onNavigate }) {
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
    { id: 3, author: 'Harini Hansara', time: 'May 21, 7:46 PM', text: "Looks good! I'll move to the next section.", avatarBg: '#3b82f6' }
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

  // Helper color map for priority badges
  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High':
        return { background: '#fee2e2', color: '#dc2626' };
      case 'Medium':
        return { background: '#fef3c7', color: '#d97706' };
      case 'Low':
        return { background: '#f1f5f9', color: '#475569' };
      default:
        return { background: '#fee2e2', color: '#dc2626' };
    }
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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
      <div style={{ flex: 1, display: 'flex', padding: '32px 48px', gap: '60px', boxSizing: 'border-box', overflowY: 'auto', background: '#ffffff' }}>
        
        {/* Left Column: Title & Metadata */}
        <div style={{ flex: '1', maxWidth: '420px' }}>
          <h1 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Design homepage</h1>
          <p style={{ margin: '0 0 32px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
            Create the homepage design based on the approved wireframes and brand guidelines.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Assignee</span>
              <span style={{ fontWeight: '500', color: '#1e293b' }}>Nadishan Withanarachchi</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Due Date</span>
              <span style={{ color: '#1e293b' }}>📅 May 23, 2024</span>
            </div>
            
            {/* Priority Dropdown Field */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Priority</span>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  ...getPriorityStyle(priority),
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  border: '1px solid #cbd5e1',
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
              <span style={{ color: '#64748b' }}>Labels</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>Design</span>
                <span style={{ background: '#f3e8ff', color: '#9333ea', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>UI/UX</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Board</span>
              <span style={{ color: '#1e293b' }}>Website Redesign</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Column</span>
              <span style={{ color: '#2563eb', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>In Progress</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Created</span>
              <span style={{ color: '#64748b', fontSize: '12px' }}>May 16, 2024 10:30 AM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Updated</span>
              <span style={{ color: '#64748b', fontSize: '12px' }}>May 21, 2024 03:15 PM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Description, Checklist & Comments */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Description Section */}
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Description</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
              The homepage should include the hero section, features overview, testimonials, and CTA section. Follow the design system and the Figma mockups.
            </p>
          </div>

          {/* Checklist Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Checklist</h3>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{completedCount}/{checklist.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {checklist.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleChecklistItem(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: item.completed ? '#94a3b8' : '#334155', cursor: 'pointer', userSelect: 'none' }}
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
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Comments</h3>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{comments.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.avatarBg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>
                    {c.author.charAt(0)}
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>{c.author}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{c.text}</p>
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
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', boxSizing: 'border-box', background: '#f8fafc' }}
              />
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}