import React, { useMemo, useState } from 'react';

export default function UpcomingTask({ onNavigate, onLogout, theme = 'light', tasks = [] }) {
  const isDark = theme === 'dark';
  const mainBg = isDark ? '#0f172a' : '#ffffff';
  const sidebarBg = isDark ? '#1e293b' : '#eff6ff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#cbd5e1';
  const [searchText, setSearchText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const upcomingTasks = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return (Array.isArray(tasks) ? tasks : [])
      .filter((task) => ['To Do', 'In Progress'].includes(task.status || 'To Do'))
      .filter((task) => {
        if (priorityFilter !== 'All' && (task.priority || 'Medium') !== priorityFilter) {
          return false;
        }

        if (!query) return true;
        return (task.title || '').toLowerCase().includes(query) || (task.tag || '').toLowerCase().includes(query);
      })
      .slice(0, 6)
      .map((task, index) => {
        const tag = (task.tag || 'General').toLowerCase();
        const type = tag.includes('design') ? 'design' : tag.includes('meeting') ? 'meeting' : tag.includes('test') ? 'test' : tag.includes('api') || tag.includes('dev') ? 'dev' : 'default';

        return {
          id: task._id || task.id || index,
          time: task.createdAt ? new Date(task.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Any time',
          title: task.title || 'Untitled task',
          desc: `Project: ${task.tag || 'CollabBoard'}`,
          priority: task.priority || 'Medium',
          type,
        };
      });
  }, [tasks]);

  const getIconStyles = (type) => {
    switch (type) {
      case 'design': return { bg: isDark ? '#422006' : '#fef3c7', color: '#d97706', icon: '🎨' };
      case 'dev': return { bg: isDark ? '#422006' : '#fef3c7', color: '#d97706', icon: '🔌' };
      case 'meeting': return { bg: isDark ? '#3b0764' : '#f3e8ff', color: '#9333ea', icon: '📅' };
      case 'test': return { bg: isDark ? '#064e3b' : '#dcfce7', color: '#16a34a', icon: '✅' };
      default: return { bg: isDark ? '#1e293b' : '#f1f5f9', color: '#64748b', icon: '📌' };
    }
  };

  const getBadgeStyles = (priority, type) => {
    if (priority === 'Low') return { bg: isDark ? '#064e3b' : '#dcfce7', color: '#16a34a' };
    if (type === 'meeting') return { bg: isDark ? '#3b0764' : '#f3e8ff', color: '#9333ea' };
    return { bg: isDark ? '#422006' : '#ffedd5', color: '#ea580c' };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: mainBg, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      <div data-legacy-sidebar style={{ width: '240px', background: sidebarBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: textColor }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '6px', borderRadius: '8px', fontSize: '14px' }}>📅</span> CollabBoard
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div onClick={() => onNavigate && onNavigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📊 Dashboard
          </div>
          <div onClick={() => onNavigate && onNavigate('profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👤 Profile
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
            📋 Tasks
          </div>
          <div onClick={() => onNavigate && onNavigate('team')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            👥 Team
          </div>
          <div onClick={() => onNavigate && onNavigate('project-overview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            📁 Project Overview
          </div>
          <div onClick={() => onNavigate && onNavigate('setting')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: subTextColor, borderRadius: '8px', cursor: 'pointer' }}>
            ⚙️ Setting
          </div>

          <button onClick={onLogout} style={{ marginTop: 'auto', padding: '10px', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#fca5a5' : '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px 60px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: textColor }}>Upcoming Tasks</h1>
            <p style={{ margin: 0, fontSize: '14px', color: subTextColor }}>View and manage your upcoming tasks.</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '8px', color: '#3b82f6', fontWeight: '500', cursor: 'pointer' }}>
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} 📅
          </button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <select style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, outline: 'none', width: '200px' }}>
            <option>All Projects</option>
            <option>CollabBoard</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, outline: 'none', width: '180px' }}
          >
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '10px', color: subTextColor }}>🔍</span>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search tasks..."
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchText('');
              setPriorityFilter('All');
            }}
            style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: subTextColor, cursor: 'pointer' }}
          >
            ⚗️
          </button>
        </div>

        <div style={{ padding: '20px', background: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}` }}>
          {upcomingTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: subTextColor, fontSize: '14px' }}>
              No upcoming tasks yet. Add a task from Project Overview first.
            </div>
          ) : (
            <>
              {upcomingTasks.map((task, index) => {
                const iconStyle = getIconStyles(task.type);
                const badgeStyle = getBadgeStyles(task.priority, task.type);
                const isLast = index === upcomingTasks.length - 1;

                return (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'stretch', minHeight: '80px' }}>
                    <div style={{ width: '80px', flexShrink: 0, textAlign: 'right', paddingRight: '20px', paddingTop: '24px', color: '#3b82f6', fontSize: '13px', fontWeight: '600' }}>
                      {task.time}
                    </div>

                    <div style={{ position: 'relative', width: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '26px', zIndex: 1, boxShadow: `0 0 0 4px ${cardBg}` }}></div>
                      {!isLast && <div style={{ width: '1px', background: borderColor, position: 'absolute', top: '34px', bottom: '-26px' }}></div>}
                    </div>

                    <div style={{ flex: 1, paddingLeft: '20px', paddingBottom: isLast ? '0' : '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: `1px solid ${borderColor}`, borderRadius: '12px', background: mainBg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: iconStyle.bg, color: iconStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            {iconStyle.icon}
                          </div>
                          <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: textColor }}>{task.title}</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: subTextColor }}>{task.desc}</p>
                          </div>
                        </div>

                        <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: badgeStyle.bg, color: badgeStyle.color }}>
                          {task.priority}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={{ textAlign: 'center', padding: '30px 0 10px 0', color: subTextColor, fontSize: '13px' }}>
                No more upcoming tasks
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
