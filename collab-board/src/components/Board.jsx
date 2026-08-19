// src/components/Board.jsx
import React, { useState } from 'react';
import { initialData } from '../mockData';
import Column from './Column';
import './Board.css';

export default function Board() {
  const [data, setData] = useState(initialData);

  return (
    <div className="board">
      <h2>CollabBoard (Milestone 1)</h2>
      <div className="column-container">
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </div>
    </div>
  );
}