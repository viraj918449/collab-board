// src/components/Column.jsx

import React from 'react';
import TaskCard from './TaskCard';
import './Column.css';

export default function Column({ column, tasks = [] }) {
  if (!column) {
    return null;
  }

  return (
    <div className="column">
      <h3>{column.title}</h3>

      <div className="task-list">
        {tasks
          .filter((task) => task && (task._id || task.id))
          .map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
            />
          ))}
      </div>
    </div>
  );
}

