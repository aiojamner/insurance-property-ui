import React from 'react'

// DashboardPieChart.jsx

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Insured Properties', value: 400 },
  { name: 'Uninsured Properties', value: 300 },
  { name: 'Expired Insurance', value: 200 },
  { name: 'Upcoming Renewals', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPieChart = () => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Insurance Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardPieChart;

