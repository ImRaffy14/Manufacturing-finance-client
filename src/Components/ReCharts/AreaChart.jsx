// components/AreaChartComponent.jsx
'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AreaChartComponent = ({ data, dataKey1, dataKey2, color1, color2 }) => (
  <ResponsiveContainer width="100%" height={500}>
    <AreaChart data={data}>
      {/* Adding grid lines */}
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area
        type="basis"
        dataKey={dataKey1}
        stroke={color1} // Main stroke color
        fill={color1}
        strokeWidth={3} // Adjust stroke width
        fillOpacity={0.6} // Adjust fill opacity for better contrast
      />
      <Area
        type="linear"
        dataKey={dataKey2}
        stroke={color2} // Main stroke color
        fill={color2}
        strokeWidth={5} // Adjust stroke width
        fillOpacity={0.6} // Adjust fill opacity for better contrast
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaChartComponent;
