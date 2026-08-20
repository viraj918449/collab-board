// src/components/CalendarPage.jsx
import React, { useState } from 'react';

export default function CalendarPage({ onLogout, onNavigate }) {
  // State for current month and year navigation (Default to August 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));

  // Filters state
  const [filters, setFilters] = useState({
    tasks: true,
    meetings: true,
    events: true,
    completed: false,
  });

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 7, 1)); // Reset to August 2026
  };

  // Helper to handle clicking a date cell and navigating to schedule with that date
  const handleDateClick = (dayNumber, monthName, year) => {
    const formattedDate = `${dayNumber} ${monthName} ${year}`;
    onNavigate('schedule', formattedDate);
  };

  // Get month name and year for display
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Dynamic calendar matrix calculation
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (year, month) => new Date(year, month, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentDate.getMonth());
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentDate.getMonth());
  
  // Previous month trailing days calculation
  const prevMonthDays = getDaysInMonth(currentYear, currentDate.getMonth() - 1);
  
  const calendarCells = [];

  // 1. Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    calendarCells.push(
      <div key={`prev-${dayNum}`} style={{ color: '#cbd5e1', padding: '4px' }}>{dayNum}</div>
    );
  }

  // 2. Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    // Highlight for August 20, 2026
    const isAug20 = currentYear === 2026 && currentDate.getMonth() === 7 && day === 20;

    calendarCells.push(
      <div 
        key={`curr-${day}`} 
        onClick={() => handleDateClick(day, currentMonthName, currentYear)} 
        style={{ padding: '4px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
      >
        {isAug20 ? (
          <>
            <div style={{ width: '24px', height: '24px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '4px' }}>{day}</div>
            <div style={{ fontSize: '10px', color: '#2563eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• Team Standup</div>
            <div style={{ fontSize: '10px', color: '#7c3aed', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• Design dashboard...</div>
          </>
        ) : (
          <div>{day}</div>
        )}
      </div>
    );
  }

  // 3. Leading days from next month to fill up standard grid view (up to 35 or 42 cells)
  const totalCellsSoFar = calendarCells.length;
  const totalGridCells = totalCellsSoFar <= 35 ? 35 : 42;
  const nextMonthDaysCount = totalGridCells - totalCellsSoFar;
  
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    calendarCells.push(
      <div key={`next-${i}`} style={{ color: '#cbd5e1', padding: '4px' }}>{i}</div>
    );
  }

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

          <div onClick={() => onNavigate('tasks')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#2563eb', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#1e293b', fontWeight: 'bold' }}>Calendar</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>View your tasks and events in calendar.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
              <button onClick={handlePrevMonth} style={{ padding: '6px 12px', background: 'transparent', border: 'none', borderRight: '1px solid #cbd5e1', cursor: 'pointer', color: '#475569' }}>&lt;</button>
              <button onClick={handleNextMonth} style={{ padding: '6px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}>&gt;</button>
            </div>
            <button onClick={handleToday} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>
              Today
            </button>
          </div>
        </div>

        {/* Content Layout: Calendar Grid (Left) & Sidebars (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
          
          {/* Calendar Grid Card */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>{currentMonthName} {currentYear}</div>
            
            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            {/* Days Grid Matrix (Dynamically Rendered) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(80px, auto)', gap: '4px', fontSize: '12px' }}>
              {calendarCells}
            </div>
          </div>

          {/* Right Column: Upcoming Events & Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Upcoming Events Box */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1e293b' }}>Upcoming Events</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
                
                <div onClick={() => onNavigate('schedule', '20 August 2026')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' }}>
                    <span style={{ color: '#2563eb' }}>●</span> Team Standup
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginLeft: '14px', borderLeft: '2px solid #e2e8f0', paddingLeft: '6px', marginTop: '2px' }}>
                    Today, 09:00 AM
                  </div>
                </div>

                <div onClick={() => onNavigate('schedule', '20 August 2026')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' }}>
                    <span style={{ color: '#2563eb' }}>●</span> Design dashboard UI
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginLeft: '14px', borderLeft: '2px solid #e2e8f0', paddingLeft: '6px', marginTop: '2px' }}>
                    Today, 10:30 AM
                  </div>
                </div>

                <div onClick={() => onNavigate('schedule', '21 August 2026')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' }}>
                    <span style={{ color: '#16a34a' }}>●</span> API integration
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginLeft: '14px', borderLeft: '2px solid #e2e8f0', paddingLeft: '6px', marginTop: '2px' }}>
                    21 August, 01:00 PM
                  </div>
                </div>

                <div onClick={() => onNavigate('schedule', '23 August 2026')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' }}>
                    <span style={{ color: '#7c3aed' }}>●</span> Client Review Meeting
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginLeft: '14px', borderLeft: '2px solid #e2e8f0', paddingLeft: '6px', marginTop: '2px' }}>
                    23 August, 04:30 PM
                  </div>
                </div>

              </div>
            </div>

            {/* Calendar Filters Box */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b' }}>Calendar Filters</h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Show</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters.tasks} onChange={() => handleFilterChange('tasks')} /> Tasks
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters.meetings} onChange={() => handleFilterChange('meetings')} /> Meetings
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters.events} onChange={() => handleFilterChange('events')} /> Events
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters.completed} onChange={() => handleFilterChange('completed')} /> Completed
                </label>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}