// Dashboard.jsx
import React from 'react';
import DashboardPieChart from './DashboardPieChart';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <DashboardPieChart />
    </div>
  );
};

export default Dashboard;
