import React from 'react';
import MetricCard from './MetricCard';
import WorkflowItem from './WorkflowItem';

const Dashboard = () => {
  const metrics = [
    { title: 'Automated Tasks', value: '1,248', change: '+24%' },
    { title: 'Time Saved', value: '412h', change: '+18%' },
    { title: 'Active Workflows', value: '32', change: '+5' },
    { title: 'Team Efficiency', value: '94%', change: '+8%' }
  ];

  const workflows = [
    { name: 'Client Onboarding', stats: '152 runs • 98% success', active: true },
    { name: 'Project Approvals', stats: '89 runs • 100% success', active: true },
    { name: 'Task Assignment', stats: '427 runs • 99% success', active: true }
  ];

  return (
    <div className="dashboard-preview">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-controls">
            <div className="dashboard-filter">
              <span>Last 30 days</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="dashboard-grid">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
            />
          ))}
        </div>
        <div className="dashboard-workflows">
          {workflows.map((workflow, index) => (
            <WorkflowItem
              key={index}
              name={workflow.name}
              stats={workflow.stats}
              active={workflow.active}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 