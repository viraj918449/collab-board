// src/components/Board.jsx

import React, { useEffect, useState } from 'react';
import Column from './Column';
import './Board.css';

import { fetchBoard, fetchTasks } from '../services/api';

export default function Board({ boardId }) {
  const [data, setData] = useState({
    board: null,
    columns: {},
    tasks: {},
    columnOrder: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // FETCH BOARD AND TASKS
  // ==========================================

  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) {
        setError('Board ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // ==========================================
        // FETCH BOARD
        // ==========================================

        const boardResponse = await fetchBoard(boardId);

        const boardResponseData = boardResponse.data;

        const board =
          boardResponseData?.board ||
          boardResponseData;

        if (!board || (!board._id && !board.id)) {
          throw new Error('Board not found');
        }

        // ==========================================
        // FETCH TASKS
        // ==========================================

        const taskResponse = await fetchTasks(boardId);

        const taskResponseData = taskResponse.data;

        const tasks = Array.isArray(taskResponseData)
          ? taskResponseData
          : Array.isArray(taskResponseData?.tasks)
            ? taskResponseData.tasks
            : [];

        // ==========================================
        // CREATE TASK MAP
        // ==========================================

        const taskMap = {};

        tasks.forEach((task) => {
          if (task && task._id) {
            taskMap[task._id] = task;
          }
        });

        // ==========================================
        // CREATE COLUMNS
        // ==========================================

        const columns = {
          todo: {
            id: 'todo',
            title: 'To Do',
            taskIds: [],
          },

          inProgress: {
            id: 'inProgress',
            title: 'In Progress',
            taskIds: [],
          },

          done: {
            id: 'done',
            title: 'Done',
            taskIds: [],
          },
        };

        // ==========================================
        // PLACE TASKS INTO COLUMNS
        // ==========================================

        tasks.forEach((task) => {
          if (!task || !task._id) {
            return;
          }

          switch (task.status) {
            case 'To Do':
              columns.todo.taskIds.push(task._id);
              break;

            case 'In Progress':
              columns.inProgress.taskIds.push(task._id);
              break;

            case 'Done':
              columns.done.taskIds.push(task._id);
              break;

            default:
              // Invalid/missing status → To Do
              columns.todo.taskIds.push(task._id);
              break;
          }
        });

        // ==========================================
        // UPDATE STATE
        // ==========================================

        setData({
          board,
          tasks: taskMap,
          columns,
          columnOrder: ['todo', 'inProgress', 'done'],
        });
      } catch (err) {
        console.error('Board loading error:', err);

        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to load board';

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadBoardData();
  }, [boardId]);

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="board">
        <h2>CollabBoard</h2>

        <div className="column-container">
          <p>Loading board...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="board">
        <h2>CollabBoard</h2>

        <div className="column-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY BOARD STATE
  // ==========================================

  if (!data.board) {
    return (
      <div className="board">
        <h2>CollabBoard</h2>

        <div className="column-container">
          <p>No board found.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // BOARD UI
  // ==========================================

  return (
    <div className="board">
      <h2>
        {data.board.title ||
          data.board.name ||
          'CollabBoard'}
      </h2>

      <div className="column-container">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];

          if (!column) {
            return null;
          }

          const tasks = column.taskIds
            .map((taskId) => data.tasks[taskId])
            .filter(Boolean);

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
            />
          );
        })}
      </div>
    </div>
  );
}

