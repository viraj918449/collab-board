// src/components/ProjectOverview.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ProjectOverview({ onNavigate, onLogout, theme = 'light' }) {
  // Theme styling variables
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  // State for tasks in columns (Starting empty to fetch from API)
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const boardInitializationStarted = useRef(false);

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

  // Edit Task modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskColumn, setEditingTaskColumn] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskTag, setEditTaskTag] = useState('Design');

  // Assign Team Member modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [assigningTaskColumn, setAssigningTaskColumn] = useState(null);
  const [assignMemberEmail, setAssignMemberEmail] = useState('');

  // Available team members for assignment
  const [teamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { id: 3, name: 'Alex Johnson', email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' }
  ]);

  const formatTask = (task) => ({
    ...task,
    id: task._id,
    date: task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Aug 24',
    avatar: task.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
  });

  const initializeBoard = async () => {
    try {
      const token = localStorage.getItem('collabToken');
      const response = await fetch(`${API_BASE_URL}/boards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return;

      const boards = await response.json();
      let activeBoard = boards[0];

      // The current design has no board-creation screen. Create one default
      // board for a new user so the existing task UI can work unchanged.
      if (!activeBoard) {
        const createResponse = await fetch(`${API_BASE_URL}/boards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: 'My Board' })
        });
        if (!createResponse.ok) return;
        activeBoard = await createResponse.json();
      }

      setBoardId(activeBoard._id);
      fetchTasks(activeBoard._id);
    } catch (err) {
      console.error('Error loading board:', err);
    }
  };

  const fetchTasks = async (activeBoardId) => {
    try {
      const token = localStorage.getItem('collabToken');
      const response = await fetch(`${API_BASE_URL}/tasks/board/${activeBoardId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const formattedTasks = (await response.json()).map(formatTask);
        setTodoTasks(formattedTasks.filter((task) => task.column === 'todo'));
        setInProgressTasks(formattedTasks.filter((task) => task.column === 'inprogress'));
        setDoneTasks(formattedTasks.filter((task) => task.column === 'done'));
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Load the user's first board before loading tasks. The UI remains unchanged,
  // but every task operation is now scoped to a board.
  useEffect(() => {
    if (boardInitializationStarted.current) return;
    boardInitializationStarted.current = true;
    initializeBoard();
  }, []);

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

  // --- API INTEGRATION: ADD TASK ---
  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !boardId) return;

    try {
      const token = localStorage.getItem('collabToken');
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: newTaskTitle, tag: newTaskTag, column: newTaskColumn, boardId })
      });

      if (response.ok) {
        const newTask = await response.json();
        
        // Format before updating UI
        const formattedTask = formatTask(newTask);

        if (newTaskColumn === 'todo') setTodoTasks([...todoTasks, formattedTask]);
        if (newTaskColumn === 'inprogress') setInProgressTasks([...inProgressTasks, formattedTask]);
        if (newTaskColumn === 'done') setDoneTasks([...doneTasks, formattedTask]);

        setNewTaskTitle('');
        setIsTaskModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    alert(`Invitation sent successfully to ${inviteEmail}!`);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  // --- API INTEGRATION: DELETE TASK ---
  const handleDeleteTask = async (taskId, column) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('collabToken');
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          if (column === 'todo') setTodoTasks(todoTasks.filter(task => task.id !== taskId));
          else if (column === 'inprogress') setInProgressTasks(inProgressTasks.filter(task => task.id !== taskId));
          else if (column === 'done') setDoneTasks(doneTasks.filter(task => task.id !== taskId));
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleEditTask = (task, column) => {
    setEditingTaskId(task.id);
    setEditingTaskColumn(column);
    setEditTaskTitle(task.title);
    setEditTaskTag(task.tag);
    setIsEditModalOpen(true);
  };

  // --- API INTEGRATION: EDIT TASK ---
  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    if (!editTaskTitle.trim()) return;

    try {
      const token = localStorage.getItem('collabToken');
      const response = await fetch(`${API_BASE_URL}/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editTaskTitle, tag: editTaskTag, column: editingTaskColumn })
      });

      if (response.ok) {
        const updateState = (tasksArray) => tasksArray.map(task => 
          task.id === editingTaskId ? { ...task, title: editTaskTitle, tag: editTaskTag } : task
        );

        if (editingTaskColumn === 'todo') setTodoTasks(updateState(todoTasks));
        else if (editingTaskColumn === 'inprogress') setInProgressTasks(updateState(inProgressTasks));
        else if (editingTaskColumn === 'done') setDoneTasks(updateState(doneTasks));

        setIsEditModalOpen(false);
        setEditingTaskId(null);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleAssignTask = (taskId, column) => {
    setAssigningTaskId(taskId);
    setAssigningTaskColumn(column);
    setAssignMemberEmail('');
    setIsAssignModalOpen(true);
  };

  // --- API INTEGRATION: ASSIGN MEMBER ---
  const handleAssignMemberSubmit = async (e) => {
    e.preventDefault();
    if (!assignMemberEmail.trim()) return;

    const member = teamMembers.find(m => m.email === assignMemberEmail);
    if (!member) return alert('Team member not found!');

    try {
      // Find the existing task data to preserve title and tag in the PUT request
      const allTasks = [...todoTasks, ...inProgressTasks, ...doneTasks];
      const taskToUpdate = allTasks.find(t => t.id === assigningTaskId);
      
      const token = localStorage.getItem('collabToken');
      const response = await fetch(`${API_BASE_URL}/tasks/${assigningTaskId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        // In a full DB, you would save the assigned member ID here too
        body: JSON.stringify({ title: taskToUpdate.title, tag: taskToUpdate.tag, column: assigningTaskColumn })
      });

      if (response.ok) {
        const updateState = (tasksArray) => tasksArray.map(task => 
          task.id === assigningTaskId ? { ...task, avatar: member.avatar, email: member.email } : task
        );

        if (assigningTaskColumn === 'todo') setTodoTasks(updateState(todoTasks));
        else if (assigningTaskColumn === 'inprogress') setInProgressTasks(updateState(inProgressTasks));
        else if (assigningTaskColumn === 'done') setDoneTasks(updateState(doneTasks));

        alert(`Task assigned to ${member.name}!`);
        setIsAssignModalOpen(false);
        setAssigningTaskId(null);
      }
    } catch (err) {
      console.error('Failed to assign member:', err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bgColor, fontFamily: 'sans-serif', boxSizing: 'border-box', color: textColor }}>
      
      {/* Sidebar */}
      <div style={{ width: '240px', background: cardBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '30px', color: textColor }}>
          <span style={{ background: '#4F5D55', color: 'white', padding: '6px', borderRadius: '8px' }}>📅</span> CollabBoard
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
          <div onClick={() => onNavigate('ProjectOverview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#4F5D55', color: 'white', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
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
            style={{ padding: '8px 16px', background: '#4F5D55', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
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
              <div key={task.id} style={{ background: cardBg, padding: '14px', borderRadius: '10px', border: `1px solid ${borderColor}`, marginBottom: '12px', position: 'relative', group: 'hover' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, flex: 1 }}>{task.title}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleEditTask(task, 'todo')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Edit Task"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleAssignTask(task.id, 'todo')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Assign Member"
                    >
                      👤
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id, 'todo')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Delete Task"
                    >
                      🗑
                    </button>
                  </div>
                </div>
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
              <div key={task.id} style={{ background: cardBg, padding: '14px', borderRadius: '10px', border: `1px solid ${borderColor}`, marginBottom: '12px', position: 'relative', group: 'hover' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, flex: 1 }}>{task.title}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleEditTask(task, 'inprogress')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Edit Task"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleAssignTask(task.id, 'inprogress')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Assign Member"
                    >
                      👤
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id, 'inprogress')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Delete Task"
                    >
                      🗑
                    </button>
                  </div>
                </div>
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
              <div key={task.id} style={{ background: cardBg, padding: '14px', borderRadius: '10px', border: `1px solid ${borderColor}`, marginBottom: '12px', position: 'relative', group: 'hover' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: textColor, flex: 1 }}>{task.title}</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleEditTask(task, 'done')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#3b82f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Edit Task"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleAssignTask(task.id, 'done')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#10b981', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Assign Member"
                    >
                      👤
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id, 'done')}
                      style={{ padding: '4px 6px', background: 'transparent', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                      title="Delete Task"
                    >
                      🗑
                    </button>
                  </div>
                </div>
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
                  style={{ padding: '8px 16px', background: '#4F5D55', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
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
                  placeholder="Kaveesha@gmail.com" 
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
                  style={{ padding: '8px 16px', background: '#4F5D55', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '28px', borderRadius: '14px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', color: textColor, animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: '600' }}>✎ Edit Task</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: subTextColor }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subTextColor, marginBottom: '8px' }}>Task Title</label>
                <input 
                  type="text" 
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  placeholder="Enter task title..." 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', boxSizing: 'border-box', background: inputBg, color: textColor, fontSize: '14px', transition: 'border-color 0.2s' }}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subTextColor, marginBottom: '8px' }}>Tag Category</label>
                <select 
                  value={editTaskTag}
                  onChange={(e) => setEditTaskTag(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor, fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="Design">Design</option>
                  <option value="Research">Research</option>
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '10px 20px', background: isDark ? '#334155' : '#e2e8f0', color: textColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Team Member Modal */}
      {isAssignModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: cardBg, padding: '28px', borderRadius: '14px', width: '420px', maxHeight: '650px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', color: textColor }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: '600' }}>👤 Assign Team Member</h3>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: subTextColor }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAssignMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subTextColor, marginBottom: '8px' }}>Select Member</label>
                <select 
                  value={assignMemberEmail}
                  onChange={(e) => setAssignMemberEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${borderColor}`, outline: 'none', background: inputBg, color: textColor, fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="">-- Choose a team member --</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.email}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: subTextColor, marginBottom: '12px' }}>Team Members</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {teamMembers.map(member => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: isDark ? '#334155' : '#f1f5f9', borderRadius: '10px', border: assignMemberEmail === member.email ? `2px solid #10b981` : `1px solid ${borderColor}`, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setAssignMemberEmail(member.email)}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden', border: '2px solid #cbd5e1' }}>
                        <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: subTextColor }}>{member.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)}
                  style={{ padding: '10px 20px', background: isDark ? '#334155' : '#e2e8f0', color: textColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' }}
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
