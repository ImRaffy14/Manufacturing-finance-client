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
    { name: 'Payable ID', selector: row => row._id },
    { name: 'Request ID', selector: row => row.requestId },
    { name: 'Category', selector: row => row.category },
    { name: 'Type of Request', selector: row => row.typeOfRequest },
    { name: 'Documents', selector: row => row.documents },
    { name: 'Reason', selector: row => row.reason },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'On process' ? 'blue' : 'red',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) },
  ];

  const data = [
    {
      _id: 'P001',
      requestId: 'REQ1001',
      category: 'Office Supplies',
      typeOfRequest: 'Purchase',
      documents: 'Invoice123.pdf',
      reason: 'For restocking office supplies',
      totalRequest: 5000.75,
      status: 'On process',
    },
    {
      _id: 'P002',
      requestId: 'REQ1002',
      category: 'Travel Expenses',
      typeOfRequest: 'Reimbursement',
      documents: 'Receipt789.jpg',
      reason: 'Business trip to client site',
      totalRequest: 15000.25,
      status: 'On process',
    },
    {
      _id: 'P003',
      requestId: 'REQ1003',
      category: 'IT Equipment',
      typeOfRequest: 'Purchase',
      documents: 'Quote567.pdf',
      reason: 'Purchase of new laptops for development team',
      totalRequest: 80000.00,
      status: 'On process',
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
