// src/components/TaskCard.jsx
import React from 'react';
import './TaskCard.css';

export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      {task.content}
    </div>
  );
}