import React from 'react';

const WorkflowItem = ({ name, stats, active }) => {
  return (
    <div className="workflow-item">
      <div className={`workflow-status ${active ? 'active' : ''}`}></div>
      <div className="workflow-name">{name}</div>
      <div className="workflow-stats">{stats}</div>
    </div>
  );
};

export default WorkflowItem; 