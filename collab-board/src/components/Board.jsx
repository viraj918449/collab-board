import React, { useEffect, useState } from 'react';
import Column from './Column';
import './Board.css';
import { createBoard, createTask, deleteTask, fetchBoard, fetchBoards, fetchTasks, inviteTeamMember, removeBoardMember, updateTask } from '../services/api';

const blank = { title: '', tag: 'General', priority: 'Medium', status: 'To Do', assignedTo: '' };
const idOf = (item) => item?._id || item?.id;
const message = (err) => err.response?.data?.message || err.response?.data?.error || err.message || 'Request failed';

export default function Board({ boardId: initialBoardId }) {
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(initialBoardId || '');
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBoards().then(({ data }) => {
      const list = Array.isArray(data) ? data : data.boards || [];
      setBoards(list);
      if (!boardId && list[0]) setBoardId(idOf(list[0]));
    }).catch((err) => setError(message(err)));
  }, []);

  useEffect(() => {
    if (!boardId) return;
    setError('');
    Promise.all([fetchBoard(boardId), fetchTasks(boardId)]).then(([boardResponse, tasksResponse]) => {
      setBoard(boardResponse.data.board || boardResponse.data);
      setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : tasksResponse.data.tasks || []);
    }).catch((err) => setError(message(err)));
  }, [boardId]);

  const submitTask = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); setError('');
      const payload = { ...form, boardId, assignedTo: form.assignedTo || null };
      const response = editingId ? await updateTask(editingId, payload) : await createTask(payload);
      const saved = response.data;
      setTasks((current) => editingId ? current.map((task) => idOf(task) === idOf(saved) ? saved : task) : [saved, ...current]);
      setForm(blank); setEditingId(null); setNotice(editingId ? 'Task updated.' : 'Task created.');
    } catch (err) { setError(message(err)); } finally { setSaving(false); }
  };
  const editTask = (task) => {
    setEditingId(idOf(task));
    setForm({ title: task.title || '', tag: task.tag || 'General', priority: task.priority || 'Medium', status: task.status || 'To Do', assignedTo: idOf(task.assignedTo) || '' });
  };
  const changeStatus = async (task, status) => {
    try { const { data } = await updateTask(idOf(task), { status }); setTasks((items) => items.map((item) => idOf(item) === idOf(data) ? data : item)); }
    catch (err) { setError(message(err)); }
  };
  const removeTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(id); setTasks((items) => items.filter((task) => idOf(task) !== id)); setNotice('Task deleted.'); }
    catch (err) { setError(message(err)); }
  };
  const addMember = async (event) => {
    event.preventDefault();
    try { setSaving(true); const { data } = await inviteTeamMember(boardId, { email: memberEmail }); setBoard(data.board); setMemberEmail(''); setNotice('Member added.'); }
    catch (err) { setError(message(err)); } finally { setSaving(false); }
  };
  const addBoard = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await createBoard({ title: newBoardTitle });
      setBoards((items) => [data, ...items]);
      setBoardId(idOf(data));
      setNewBoardTitle('');
      setNotice('Board created.');
    } catch (err) { setError(message(err)); } finally { setSaving(false); }
  };
  const removeMember = async (id) => {
    if (!window.confirm('Remove this member from the board?')) return;
    try { const { data } = await removeBoardMember(boardId, id); setBoard(data.board); setNotice('Member removed.'); }
    catch (err) { setError(message(err)); }
  };

  const members = board?.members || [];
  const statuses = ['To Do', 'In Progress', 'Done'];
  return <main className="board">
    <header className="board__header"><div><h2>{board?.title || 'Boards'}</h2><p>Manage tasks and board members.</p></div><div><select value={boardId} onChange={(event) => setBoardId(event.target.value)}><option value="">Select a board</option>{boards.map((item) => <option key={idOf(item)} value={idOf(item)}>{item.title}</option>)}</select><form className="board__member-form" onSubmit={addBoard}><input required placeholder="New board name" value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)}/><button disabled={saving}>Create board</button></form></div></header>
    {error && <p className="board__message board__message--error">{error}</p>}{notice && <p className="board__message">{notice}</p>}
    {!board && <p>Select or create a board to begin.</p>}
    {board && <><section className="board__panel"><h3>{editingId ? 'Edit task' : 'New task'}</h3><form className="board__form" onSubmit={submitTask}><input required placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/><input required placeholder="Tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}/><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((value) => <option key={value}>{value}</option>)}</select><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select><select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}><option value="">Unassigned</option>{members.map((member) => <option key={idOf(member)} value={idOf(member)}>{member.name || member.email}</option>)}</select><button disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save task' : 'Create task'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}</form></section>
    <section className="board__panel"><h3>Board members</h3><form className="board__member-form" onSubmit={addMember}><input type="email" required placeholder="Existing user email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}/><button disabled={saving}>Add member</button></form><ul className="board__members">{members.map((member) => <li key={idOf(member)}><span>{member.name || member.email} <small>{member.email}</small></span>{idOf(member) !== idOf(board.owner) && <button type="button" onClick={() => removeMember(idOf(member))}>Remove</button>}</li>)}</ul></section>
    <section className="column-container">{statuses.map((status) => <Column key={status} column={{ id: status, title: status }} tasks={tasks.filter((task) => (task.status || 'To Do') === status)} onEdit={editTask} onDelete={removeTask} onStatusChange={changeStatus}/>)}</section></>}
  </main>;
}
