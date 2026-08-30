import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createBoard, createTask, deleteTask, fetchBoards, fetchTasks, inviteTeamMember, updateTask } from '../services/api';
import './ProjectOverview.css';

const idOf = (item) => item?._id || item?.id;
const newTask = (boardId = '', status = 'To Do') => ({ title: '', tag: 'General', priority: 'Medium', assignedTo: '', boardId, status });
const errorText = (error) => error.response?.data?.message || error.message || 'Something went wrong.';
const dateLabel = (date) => date ? new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : 'No date';
const initials = (person) => (person?.name || person?.email || '?').trim().slice(0, 2).toUpperCase();

export default function ProjectOverview({ theme = 'light', onNavigate, tasks: sharedTasks = [], onTasksChange, onTaskCreated }) {
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [tasks, setTasks] = useState(sharedTasks);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [taskForm, setTaskForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingVersion, setEditingVersion] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [projectCreateOpen, setProjectCreateOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Project Name');
  const [saving, setSaving] = useState(false);
  const statuses = ['To Do', 'In Progress', 'Done'];

  const loadBoards = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchBoards();
      const list = Array.isArray(data) ? data : data.boards || [];
      setBoards(list);
      setBoardId((current) => current && list.some((board) => idOf(board) === current) ? current : idOf(list[0]) || '');
    } catch (requestError) { setError(errorText(requestError)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { setTasks(sharedTasks); }, [sharedTasks]);

  useEffect(() => { loadBoards(); }, [loadBoards]);
  useEffect(() => {
    if (!boardId) {
      setTasks([]);
      onTasksChange?.([]);
      return;
    }

    fetchTasks(boardId)
      .then(({ data }) => {
        const nextTasks = Array.isArray(data) ? data : data.tasks || [];
        setTasks(nextTasks);
        onTasksChange?.(nextTasks);
      })
      .catch((requestError) => setError(errorText(requestError)));
  }, [boardId, onTasksChange]);

  const selectedBoard = boards.find((board) => idOf(board) === boardId);
  const visibleTasks = useMemo(() => tasks.filter((task) => task.title?.toLowerCase().includes(query.trim().toLowerCase())), [query, tasks]);
  const updateTasks = useCallback((updater) => {
    setTasks((currentTasks) => {
      const nextTasks = typeof updater === 'function' ? updater(currentTasks) : updater;
      onTasksChange?.(nextTasks);
      return nextTasks;
    });
  }, [onTasksChange]);
  const openTaskForm = (status = 'To Do', task = null) => {
    setEditingId(task ? idOf(task) : null);
    setEditingVersion(task?.version ?? 0);
    setTaskForm(task ? { title: task.title || '', tag: task.tag || 'General', priority: task.priority || 'Medium', assignedTo: idOf(task.assignedTo) || '', boardId, status: task.status || status } : newTask(boardId, status));
  };
  const saveTask = async (event) => {
    event.preventDefault(); if (!taskForm.title.trim()) return;
    setSaving(true); setError('');
    try {
      const payload = {
        ...taskForm,
        title: taskForm.title.trim(),
        assignedTo: taskForm.assignedTo || null,
        ...(editingId ? { version: editingVersion ?? 0 } : {}),
      };
      const { data } = editingId ? await updateTask(editingId, payload) : await createTask(payload);
      updateTasks((current) => editingId ? current.map((task) => idOf(task) === idOf(data) ? data : task) : [data, ...current]);
      if (!editingId) onTaskCreated?.(data);
      setTaskForm(null); setEditingId(null); setEditingVersion(null); setNotice(editingId ? 'Task updated.' : 'Task added.');
    } catch (requestError) {
      const latestTask = requestError.response?.data?.latestTask;
      if (latestTask) {
        updateTasks((current) => current.map((task) => idOf(task) === idOf(latestTask) ? latestTask : task));
        setEditingVersion(latestTask.version ?? 0);
      }
      setError(errorText(requestError));
    }
    finally { setSaving(false); }
  };
  const removeTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await deleteTask(idOf(task));
      updateTasks((current) => current.filter((item) => idOf(item) !== idOf(task)));
      setNotice('Task deleted.');
    }
    catch (requestError) { setError(errorText(requestError)); }
  };
  const inviteMember = async (event) => {
    event.preventDefault(); if (!inviteEmail.trim() || !boardId) return;
    setSaving(true); setError('');
    try {
      const { data } = await inviteTeamMember(boardId, { email: inviteEmail.trim() });
      setBoards((current) => current.map((board) => idOf(board) === boardId ? data.board : board));
      setInviteEmail(''); setInviteOpen(false); setNotice('Member invited successfully.');
    } catch (requestError) { setError(errorText(requestError)); }
    finally { setSaving(false); }
  };
  const createProject = async (event) => {
    event.preventDefault();
    if (!projectTitle.trim()) return;
    setSaving(true); setError('');
    try {
      const { data } = await createBoard({ title: projectTitle.trim() });
      setBoards((current) => [data, ...current]);
      setBoardId(idOf(data));
      setProjectCreateOpen(false);
      setNotice('Project created. You can now add tasks.');
    } catch (requestError) { setError(errorText(requestError)); }
    finally { setSaving(false); }
  };

  return <div className={`project-board ${theme === 'dark' ? 'project-board--dark' : ''}`}>
    <aside className="project-board__sidebar"><div className="project-board__brand"><span>▦</span> CollabBoard</div><nav className="project-board__nav"><button onClick={() => onNavigate('dashboard')}>📊 Dashboard</button><button onClick={() => onNavigate('profile')}>👤 Profile</button><button onClick={() => onNavigate('tasks')}>📋 Tasks</button><button onClick={() => onNavigate('team')}>👥 Team</button><button className="is-active">📁 Project Overview</button><button onClick={() => onNavigate('setting')}>⚙️ Setting</button></nav><button className="project-board__logout" onClick={() => onNavigate('login')}>Logout</button></aside>
    <main className="project-board__content">
      <header className="project-board__header"><div>{boards.length > 1 ? <select className="project-board__board-picker" value={boardId} onChange={(event) => setBoardId(event.target.value)}>{boards.map((board) => <option key={idOf(board)} value={idOf(board)}>{board.title}</option>)}</select> : <h1>{selectedBoard?.title || 'Project Name'}</h1>}{selectedBoard?.description && <p>{selectedBoard.description}</p>}</div>{boardId ? <button className="project-board__invite" onClick={() => setInviteOpen(true)}>+ Invite</button> : <button className="project-board__invite" onClick={() => setProjectCreateOpen(true)}>+ Create Project</button>}</header>
      <div className="project-board__toolbar"><label className="project-board__search"><span>🔍</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks....." /></label><button className="project-board__add" onClick={() => openTaskForm()} disabled={!boardId}>+ Add Task</button></div>
      {(error || notice) && <div className={`project-board__message ${error ? 'project-board__message--error' : ''}`}>{error || notice}<button onClick={() => { setError(''); setNotice(''); }}>×</button></div>}
      {loading ? <div className="project-board__empty">Loading projects...</div> : !boardId ? <div className="project-board__empty">No project found. Create a board from the Board page first.</div> : <section className="project-board__columns">{statuses.map((status) => <section key={status} className={`project-board__column project-board__column--${status.toLowerCase().replace(' ', '-')}`}><h2>{status === 'In Progress' ? 'In progress' : status}</h2><div className="project-board__task-list">{visibleTasks.filter((task) => (task.status || 'To Do') === status).map((task) => <article key={idOf(task)} className="project-board__task"><div className="project-board__task-actions"><button title="Edit task" onClick={() => openTaskForm(status, task)}>✎</button><button title="Change assignee" onClick={() => openTaskForm(status, task)}>♟</button><button title="Delete task" onClick={() => removeTask(task)}>♙</button></div><h3>{task.title}</h3><span className={`project-board__tag project-board__tag--${(task.tag || 'general').toLowerCase().replace(/\s+/g, '-')}`}>{task.tag || 'General'}</span><footer><span>{dateLabel(task.createdAt)}</span><button title={task.assignedTo?.name || task.assignedTo?.email || 'Unassigned'} className="project-board__avatar">{initials(task.assignedTo)}</button></footer></article>)}</div><button className="project-board__add-link" onClick={() => openTaskForm(status)}>+ Add Task</button></section>)}</section>}
    </main>
    {taskForm && <div className="project-board__modal-backdrop"><form className="project-board__modal" onSubmit={saveTask}><div className="project-board__modal-title"><h2>{editingId ? 'Edit Task' : 'Add Task'}</h2><button type="button" onClick={() => setTaskForm(null)}>×</button></div><label>Task name<input required value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} /></label><label>Tag<input required value={taskForm.tag} onChange={(event) => setTaskForm({ ...taskForm, tag: event.target.value })} /></label><div className="project-board__modal-grid"><label>Status<select value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Priority<select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label></div><label>Assign to<select value={taskForm.assignedTo} onChange={(event) => setTaskForm({ ...taskForm, assignedTo: event.target.value })}><option value="">Unassigned</option>{(selectedBoard?.members || []).map((member) => <option key={idOf(member)} value={idOf(member)}>{member.name || member.email}</option>)}</select></label><div className="project-board__modal-buttons"><button type="button" onClick={() => setTaskForm(null)}>Cancel</button><button disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Task'}</button></div></form></div>}
    {projectCreateOpen && <div className="project-board__modal-backdrop"><form className="project-board__modal project-board__modal--small" onSubmit={createProject}><div className="project-board__modal-title"><h2>Create Project</h2><button type="button" onClick={() => setProjectCreateOpen(false)}>×</button></div><label>Project name<input required autoFocus value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="Project Name" /></label><div className="project-board__modal-buttons"><button type="button" onClick={() => setProjectCreateOpen(false)}>Cancel</button><button disabled={saving}>{saving ? 'Creating...' : 'Create Project'}</button></div></form></div>}
    {inviteOpen && <div className="project-board__modal-backdrop"><form className="project-board__modal project-board__modal--small" onSubmit={inviteMember}><div className="project-board__modal-title"><h2>Invite Member</h2><button type="button" onClick={() => setInviteOpen(false)}>×</button></div><label>Email address<input type="email" required autoFocus value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="member@example.com" /></label><div className="project-board__modal-buttons"><button type="button" onClick={() => setInviteOpen(false)}>Cancel</button><button disabled={saving}>{saving ? 'Inviting...' : 'Invite'}</button></div></form></div>}
  </div>;
}
