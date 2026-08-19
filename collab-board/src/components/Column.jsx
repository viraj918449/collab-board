// src/components/Column.jsx
import React from 'react';
import TaskCard from './TaskCard';
import './Column.css';

export default function Column({ column, tasks }) {
  return (
    <div className="column">
      <h3>{column.title}</h3>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}