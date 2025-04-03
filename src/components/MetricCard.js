import React from 'react';

const MetricCard = ({ title, value, change }) => {
  return (
    <div className="metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-change positive">{change}</div>
      <div className="metric-chart"></div>
    </div>
  );
};

export default MetricCard; 