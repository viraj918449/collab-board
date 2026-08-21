import React, { useState } from 'react';
import './Upcomingtask.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'tasks', label: 'Tasks', icon: '📋' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'project-overview', label: 'Project Overview', icon: '📁' },
  { id: 'setting', label: 'Setting', icon: '⚙️' },
];

export default function Sidebar({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    onNavigate?.(item.view ?? item.id);
  };

  return (
    <aside className="upcoming-sidebar">
      <div className="upcoming-sidebar__logo">
        <div className="upcoming-sidebar__logo-mark">
          📅
        </div>
        <h1>CollabBoard</h1>
      </div>

      <nav className="upcoming-sidebar__nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item)}
              className={`upcoming-sidebar__nav-item${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="upcoming-sidebar__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}