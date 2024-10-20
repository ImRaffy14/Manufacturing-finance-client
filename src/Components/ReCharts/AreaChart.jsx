// components/AreaChartComponent.jsx
'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const formatCurrency = (value) => {
  return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};

const AreaChartComponent = ({ data, dataKey1, dataKey2, color1, color2 }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <XAxis dataKey="_id" />
      <YAxis tickFormatter={formatCurrency} />
      <Tooltip formatter={(value) => formatCurrency(value)} />
      <Area
        type="basis"
        dataKey={dataKey1}
        stroke={color1}
        fill={color1}
        strokeWidth={3}
        fillOpacity={0.6}
      />
      <Area
        type="linear"
        dataKey={dataKey2}
        stroke={color2}
        fill={color2}
        strokeWidth={5}
        fillOpacity={0.6}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaChartComponent;
