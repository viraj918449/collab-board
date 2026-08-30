// src/components/Schedule.jsx
import React, { useMemo, useState } from 'react';

export default function Schedule({ onLogout, onNavigate, selectedDate = '20 August 2026', theme = 'light', scheduleItems = [], onScheduleItemsChange }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const selectedDateKey = (() => {
    const date = new Date(selectedDate);
    if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  })();
  const [editingItem, setEditingItem] = useState(null);
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [form, setForm] = useState({ title: '', time: '09:00', type: 'Task', status: 'Planned', details: '' });
  const [error, setError] = useState('');

  // Timeline events data matching the design
  const defaultTimelineEvents = [
    { time: '09:00 AM', title: 'Team Standup', subtitle: 'Daily sync with the team', type: 'Meeting', statusBg: isDark ? '#3b0764' : '#f3e8ff', statusColor: isDark ? '#d8b4fe' : '#7e22ce', icon: '📅' },
    { time: '10:30 AM', title: 'Design dashboard UI', subtitle: 'Project: CollabBoard', type: 'In Progress', statusBg: isDark ? '#082f49' : '#e0f2fe', statusColor: isDark ? '#7dd3fc' : '#0369a1', icon: '💻' },
    { time: '01:00 PM', title: 'API integration', subtitle: 'Project: CollabBoard', type: 'In Progress', statusBg: isDark ? '#082f49' : '#e0f2fe', statusColor: isDark ? '#7dd3fc' : '#0369a1', icon: '⚡' },
    { time: '03:00 PM', title: 'User testing', subtitle: 'Project: CollabBoard', type: 'Completed', statusBg: isDark ? '#052e16' : '#dcfce7', statusColor: isDark ? '#86efac' : '#15803d', icon: '✅' },
    { time: '04:30 PM', title: 'Client Review Meeting', subtitle: 'Review project progress', type: 'Meeting', statusBg: isDark ? '#3b0764' : '#f3e8ff', statusColor: isDark ? '#d8b4fe' : '#7e22ce', icon: '📅' }
  ];
  const timelineEvents = useMemo(() => scheduleItems
    .filter((item) => item.date === selectedDateKey)
    .sort((first, second) => first.time.localeCompare(second.time))
    .map((item) => ({
      ...item,
      scheduleTime: item.time,
      time: new Date(`2000-01-01T${item.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      subtitle: item.details || item.type,
      statusBg: item.status === 'Completed' ? (isDark ? '#052e16' : '#dcfce7') : item.status === 'In Progress' ? (isDark ? '#082f49' : '#e0f2fe') : (isDark ? '#3b0764' : '#f3e8ff'),
      statusColor: item.status === 'Completed' ? (isDark ? '#86efac' : '#15803d') : item.status === 'In Progress' ? (isDark ? '#7dd3fc' : '#0369a1') : (isDark ? '#d8b4fe' : '#7e22ce'),
      icon: item.type === 'Meeting' ? '📅' : item.status === 'Completed' ? '✅' : '📌',
    })), [scheduleItems, selectedDateKey, isDark]);
  const openNewSchedule = () => {
    setEditingItem(null);
    setForm({ title: '', time: '09:00', type: 'Task', status: 'Planned', details: '' });
    setError('');
    setIsScheduleFormOpen(true);
  };
  const openEditSchedule = (item) => {
    setEditingItem(item);
    setForm({ title: item.title, time: item.scheduleTime || item.time, type: item.type, status: item.status, details: item.details || '' });
    setError('');
    setIsScheduleFormOpen(true);
  };
  const closeScheduleForm = () => { setEditingItem(null); setForm({ title: '', time: '09:00', type: 'Task', status: 'Planned', details: '' }); setError(''); setIsScheduleFormOpen(false); };
  const saveSchedule = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.time) { setError('Please enter a title and time.'); return; }
    const item = { ...form, id: editingItem?.id || `schedule-${Date.now()}`, date: selectedDateKey, title: form.title.trim() };
    onScheduleItemsChange?.((items) => editingItem ? items.map((current) => current.id === editingItem.id ? item : current) : [...items, item]);
    closeScheduleForm();
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

          <button type="button" onClick={openNewSchedule} style={{ padding: '8px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Add Schedule
          </button>

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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: evt.statusBg, color: evt.statusColor, padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                      {evt.status || evt.type}
                    </span>
                    {evt.id && <button type="button" onClick={() => openEditSchedule(evt)} style={{ padding: '5px 9px', background: 'transparent', border: `1px solid ${borderColor}`, borderRadius: '6px', color: '#2563eb', fontSize: '12px', cursor: 'pointer' }}>Edit</button>}
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {isScheduleFormOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(15, 23, 42, 0.55)' }}>
          <form onSubmit={saveSchedule} style={{ width: '100%', maxWidth: '440px', padding: '24px', borderRadius: '12px', background: cardBg, color: textColor, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>{editingItem ? 'Edit Schedule' : 'Add Schedule'}</h2>
                <p style={{ margin: '5px 0 0', fontSize: '13px', color: subTextColor }}>{selectedDate}</p>
              </div>
              <button type="button" onClick={closeScheduleForm} aria-label="Close" style={{ border: 'none', background: 'transparent', color: subTextColor, fontSize: '26px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: subTextColor }}>Title
                <input autoFocus required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Team standup" style={{ padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '8px', background: bgColor, color: textColor, font: 'inherit' }} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: subTextColor }}>Time
                  <input type="time" required value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} style={{ padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '8px', background: bgColor, color: textColor, font: 'inherit' }} />
                </label>
                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: subTextColor }}>Type
                  <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} style={{ padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '8px', background: bgColor, color: textColor, font: 'inherit' }}>
                    <option>Task</option><option>Meeting</option><option>Reminder</option>
                  </select>
                </label>
              </div>
              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: subTextColor }}>Status
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} style={{ padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '8px', background: bgColor, color: textColor, font: 'inherit' }}>
                  <option>Planned</option><option>In Progress</option><option>Completed</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: subTextColor }}>Details (optional)
                <textarea value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Add a short note" rows="3" style={{ padding: '10px', border: `1px solid ${borderColor}`, borderRadius: '8px', background: bgColor, color: textColor, font: 'inherit', resize: 'vertical' }} />
              </label>
              {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>{error}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button type="button" onClick={closeScheduleForm} style={{ padding: '9px 14px', background: 'transparent', color: textColor, border: `1px solid ${borderColor}`, borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '9px 14px', background: '#2563eb', color: 'white', border: '1px solid #2563eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingItem ? 'Save Changes' : 'Add Schedule'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
