// src/mockData.js
export const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design system architecture diagram' },
    'task-2': { id: 'task-2', content: 'Set up Express server routes' },
    'task-3': { id: 'task-3', content: 'Connect MongoDB via Mongoose' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Doing',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};