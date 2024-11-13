import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';

function anomalyDetection() {
  const [searchText, setSearchText] = useState('');

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; // or return an appropriate placeholder
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Transaction ID', selector: row => row.transactionId },
    { name: 'Transaction Date', selector: row => row.transactionDate },
    { name: 'Amount', selector: row => formatCurrency(row.amount) },
    { name: 'Transaction Type', selector: row => row.transactionType },
    { name: 'Anomaly Score', selector: row => row.anomalyScore.toFixed(2) },
  ];
  
  const data = [
    {
      transactionId: 'TX001',
      transactionDate: '2024-11-10',
      amount: 50000,
      transactionType: 'Purchase',
      anomalyScore: 0.95, // High anomaly score indicating possible fraud
    },
    {
      transactionId: 'TX002',
      transactionDate: '2024-11-11',
      amount: 1500,
      transactionType: 'Refund',
      anomalyScore: 0.10, // Low anomaly score, likely a normal transaction
    },
    {
      transactionId: 'TX003',
      transactionDate: '2024-11-12',
      amount: 120000,
      transactionType: 'Purchase',
      anomalyScore: 0.85, // High anomaly score due to large amount
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

// Filter data based on search text
const filteredData = data.filter(row =>
  Object.values(row).some(value =>
    value.toString().toLowerCase().includes(searchText.toLowerCase())
  )
);

  return (
    <>
          <div className="max-w-screen-2xl mx-auto mt-4">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
          <div className="mx-4">
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Anomaly Detection"
                columns={columns}
                data={filteredData}
                pagination
                defaultSortField="name"
                highlightOnHover
                pointerOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearch}
                    className="mb-2 p-2 border border-gray-400 rounded-lg"
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default anomalyDetection
