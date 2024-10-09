// SalesPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const SalesPieChart = () => {
    // Sample sales data
    const salesData = {
        labels: ['JJM Calamansi Dishwashing Liquid', 'JJM Lemon Dishwashing Liquid', 'JJM Antibac Fabric Conditioner', 'JJM Calamansi Dishwashing Paste'],
        datasets: [
            {
                label: 'Sales Count',
                data: [10, 15, 20, 25],
                backgroundColor: [
                    'rgb(74 222 128)',
                    'rgb(96 165 250)',
                    'rgb(250 204 21)',
                    'rgb(248 113 113)',
                ],
                borderColor: [
                    'rgb(74 222 128)',
                    'rgb(96 165 250)',
                    'rgb(250 204 21)',
                    'rgb(248 113 113)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right', // Move labels to the right
                align: 'center',  // Align the labels vertically centered
                labels: {
                    boxWidth: 20,    // Adjust the size of the legend box
                    padding: 20,     // Add space between legend items and chart
                },
            },
            title: {
                display: true,
                text: 'Total Sales of JJM Soap Items',
            },
        },
    };

    return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '350px', // Adjust height based on your layout
          }}
        >
          <div style={{ width: '600px', height: '600px' }}> {/* Set custom size here */}
            <Pie data={salesData} options={options} />
          </div>
        </div>
    );
};

export default SalesPieChart;
