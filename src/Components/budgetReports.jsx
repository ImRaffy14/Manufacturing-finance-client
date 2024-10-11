
import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from "react";

function budgetReports() {
  const [budgetRequest, setBudgetRequest] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [reason, setReason] = useState('');
  const [searchText, setSearchText] = useState('');
  const [requestId, setRequestId] = useState('');
  const [category, setCategory] = useState('');
  const [typeOfRequest, setTypeOfRequest] = useState ('');
  const [documents, setDocuments] = useState ('');
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  // Handle row click to show modal
const [totalRequest, setTotalRequest] = useState(0);
  const formatCurrency = (value) => {
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

const handleRowClick = (row) => {
  setSelectedRowData(row);  
  document.getElementById('budgetReports_modal').showModal();
 };

 if (!isLoading) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="skeleton h-[520px] w-full"></div>
      <div className="skeleton h-20 w-full"></div>
      <div className="skeleton h-20 w-full"></div>
      <div className="skeleton h-20 w-full"></div>
    </div>
  );
}

  return (
    <>

<div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Budget Reports"
                            columns={columns}
                            data={filteredData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handleRowClick}
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
  {/* Modal for displaying row data */}
{selectedRowData && (
        <dialog id="budgetReports_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Details for Payable ID: {selectedRowData._id}</h3>
            <div className="py-4">
              <p><strong>Request ID:</strong> {selectedRowData.requestId}</p>
              <p><strong>Category:</strong> {selectedRowData.category}</p>
              <p><strong>Type of Request:</strong> {selectedRowData.typeOfRequest}</p>
              <p><strong>Documents:</strong> {selectedRowData.documents}</p>
              <p><strong>Reason:</strong> {selectedRowData.reason}</p>
              <p><strong>Total Amount:</strong> {selectedRowData.totalRequest}</p>
              <p><strong>Status:</strong> {selectedRowData.status}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => document.getElementById('budgetReports_modal').close()}
            >
              Close
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('budgetReports_modal').close()}>
              Close
            </button>
          </form>
        </dialog>
      )}
    </>
  )
}

export default budgetReports
