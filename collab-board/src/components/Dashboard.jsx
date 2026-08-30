// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchBoards, fetchTasks, getCurrentUser } from '../services/api';

const isSameDay = (firstDate, secondDate) => (
  firstDate.getFullYear() === secondDate.getFullYear()
  && firstDate.getMonth() === secondDate.getMonth()
  && firstDate.getDate() === secondDate.getDate()
);

const formatScheduleDate = (date) => date.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function Dashboard({ onLogout, onNavigate, theme = 'light', tasks = [], onTasksChange }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  // Local state for interactive features
  const [activities, setActivities] = useState([
    { id: 1, text: "🚀 Nimali moved 'Design Login Page' to In Progress", time: '2m ago' },
    { id: 2, text: "⚡ Hasidu completed 'API Integration'", time: '10m ago' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [today, setToday] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [userName, setUserName] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('collabUser') || 'null')?.name || '';
    } catch {
      return '';
    }
  });
  const [taskOverview, setTaskOverview] = useState({
    completed: 0,
    inProgress: 0,
    loading: true,
    error: false,
  });

  // Keep the dashboard calendar accurate if it remains open after midnight.
  useEffect(() => {
    let timerId;
    const scheduleRefresh = () => {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 1, 0);
      timerId = window.setTimeout(() => {
        setToday(new Date());
        scheduleRefresh();
      }, tomorrow.getTime() - Date.now());
    };

    scheduleRefresh();
    return () => window.clearTimeout(timerId);
  }, []);

  // Keep the time-based greeting and signed-in user's name current.
  useEffect(() => {
    const timerId = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    let isActive = true;
    getCurrentUser()
      .then(({ data }) => {
        if (!isActive) return;
        setUserName(data.name || '');
        localStorage.setItem('collabUser', JSON.stringify(data));
      })
      .catch(() => {
        // The cached profile is used when the API is temporarily unavailable.
      });
    return () => { isActive = false; };
  }, []);

  // Build the overview from real tasks across every board the user can access.
  useEffect(() => {
    let isActive = true;

    const loadTaskOverview = async () => {
      try {
        const { data } = await fetchBoards();
        const boards = Array.isArray(data) ? data : data.boards || [];
        const taskResponses = await Promise.all(
          boards.map((board) => fetchTasks(board._id || board.id))
        );
        const allTasks = taskResponses.flatMap(({ data: taskData }) => (
          Array.isArray(taskData) ? taskData : taskData.tasks || []
        ));
        const total = allTasks.length;
        const percentageForStatus = (status) => (
          total === 0
            ? 0
            : Math.round((allTasks.filter((task) => task.status === status).length / total) * 100)
        );

        if (isActive) {
          setTaskOverview({
            completed: percentageForStatus('Done'),
            inProgress: percentageForStatus('In Progress'),
            loading: false,
            error: false,
          });
        }
      } catch {
        if (isActive) {
          setTaskOverview((current) => ({ ...current, loading: false, error: true }));
        }
      }
    };

    loadTaskOverview();
    return () => {
      isActive = false;
    };
  }, []);

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

    onTasksChange?.((currentTasks) => [newTask, ...currentTasks]);
    setActivities([
      { id: Date.now(), text: `✨ You added a new task '${newTaskTitle}'`, time: 'Just now' },
      ...activities
    ]);

    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  // Toggle task completion
  const toggleTaskStatus = (id) => {
    onTasksChange?.((currentTasks) => currentTasks.map(task => {
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

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentMonthName = today.toLocaleDateString('en-GB', { month: 'long' });
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dashboardCalendarDays = [];

  for (let offset = firstDayOfWeek; offset > 0; offset--) {
    dashboardCalendarDays.push({
      date: new Date(currentYear, currentMonth, 1 - offset),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day++) {
    dashboardCalendarDays.push({
      date: new Date(currentYear, currentMonth, day),
      isCurrentMonth: true,
    });
  }

  const totalGridCells = dashboardCalendarDays.length <= 35 ? 35 : 42;
  for (let day = 1; dashboardCalendarDays.length < totalGridCells; day++) {
    dashboardCalendarDays.push({
      date: new Date(currentYear, currentMonth + 1, day),
      isCurrentMonth: false,
    });
  }

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

        {/* Time-based greeting */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: textColor, fontWeight: 'bold' }}>{greeting}{userName ? `, ${userName}` : ''} 👋</h1>
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
                    <span style={{ fontWeight: 'bold' }}>{taskOverview.loading ? '...' : `${taskOverview.completed}%`}</span>
                  </div>
                  <div style={{ width: '100%', background: isDark ? '#334155' : '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ width: `${taskOverview.completed}%`, background: '#2563eb', height: '100%', transition: 'width 200ms ease' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: textColor }}>
                    <span>In Progress</span>
                    <span style={{ fontWeight: 'bold' }}>{taskOverview.loading ? '...' : `${taskOverview.inProgress}%`}</span>
                  </div>
                  <div style={{ width: '100%', background: isDark ? '#334155' : '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${taskOverview.inProgress}%`, background: '#ca8a04', height: '100%', transition: 'width 200ms ease' }}></div>
                  </div>
                  {taskOverview.error && (
                    <div style={{ marginTop: '10px', color: '#dc2626', fontSize: '11px' }}>Unable to load task progress.</div>
                  )}
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
              <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '10px' }}>{currentMonthName} {currentYear}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px', color: subTextColor }}>
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                {dashboardCalendarDays.map(({ date, isCurrentMonth }) => {
                  const isToday = isSameDay(date, today);
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => onNavigate('schedule', formatScheduleDate(date))}
                      aria-label={formatScheduleDate(date)}
                      style={{
                        background: isToday ? '#2563eb' : 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        color: isToday ? 'white' : (isCurrentMonth ? textColor : subTextColor),
                        cursor: 'pointer',
                        font: 'inherit',
                        fontWeight: isToday ? 'bold' : 'normal',
                        opacity: isCurrentMonth ? 1 : 0.5,
                        padding: '2px 0',
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
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
