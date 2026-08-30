import React from 'react';
import Board from './Board';

// Project Overview is the authenticated board workspace. Keeping this
// component as a wrapper preserves existing imports and navigation targets.
export default function ProjectOverview() {
  return <Board />;
}
