import React from 'react';
import './Sidebar.css';

const navigation = [
  ['dashboard', '📊', 'Dashboard'], ['profile', '👤', 'Profile'], ['tasks', '📋', 'Tasks'],
  ['team', '👥', 'Team'], ['project-overview', '📁', 'Project Overview'],
  ['schedule', '📋', 'Schedule'], ['setting', '⚙️', 'Settings'],
];

export default function Sidebar({ currentView, onNavigate, onLogout, theme = 'light' }) {
  return <aside className={`sidebar sidebar--${theme}`} aria-label="Main navigation">
    <button className="sidebar__brand" type="button" onClick={() => onNavigate('dashboard')}><span className="sidebar__brand-mark">📅</span><span>CollabBoard</span></button>
    <nav className="sidebar__nav">{navigation.map(([view, icon, label]) => <button key={view} type="button" className={`sidebar__link ${currentView === view ? 'sidebar__link--active' : ''}`} onClick={() => onNavigate(view)}><span aria-hidden="true">{icon}</span><span>{label}</span></button>)}</nav>
    <button className="sidebar__logout" type="button" onClick={onLogout}>Logout</button>
  </aside>;
}
