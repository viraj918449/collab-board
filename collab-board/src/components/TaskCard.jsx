// src/components/TaskCard.jsx
import React from 'react';
import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const id = task._id || task.id;
  const assignee = task.assignedTo?.name || task.assignedTo?.email;

  return (
    <article className="task-card">
      <div className="task-card__header">
        <span className="task-card__tag">{task.tag}</span>
        <span className={`task-card__priority task-card__priority--${(task.priority || 'Medium').toLowerCase()}`}>{task.priority || 'Medium'}</span>
      </div>
      <h4>{task.title}</h4>
      {assignee && <p className="task-card__assignee">Assigned to {assignee}</p>}
      <div className="task-card__actions">
        <select aria-label={`Status for ${task.title}`} value={task.status || 'To Do'} onChange={(event) => onStatusChange?.(task, event.target.value)}>
          <option>To Do</option><option>In Progress</option><option>Done</option>
        </select>
        <button type="button" onClick={() => onEdit?.(task)}>Edit</button>
        <button type="button" className="task-card__delete" onClick={() => onDelete?.(id)}>Delete</button>
      </div>
    </article>
  );
}
