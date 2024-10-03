import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";

function approveRejectPayables() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null); 
  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; // or return an appropriate placeholder
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const columns = [
    { name: 'Request ID', selector: row => row._id },
  { name: 'Category', selector: row => row.category },
  { name: 'Type of Request', selector: row => row.typeOfRequest },
  { name: 'Documents', selector: row => row.documents },
  { name: 'Commets', selector: row => row.comments || 'Burat'},
  { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},
    { name: 'Status',
                    selector: row => (
                      <span style={{ 
                        color: row.status === 'Rejected' ? 'red' : row.status === 'Approved' ? 'green' : 'inherit',
                        fontWeight: 'bold' 
                      }}>
                        {row.status}
                      </span>)
                      },
    
  ];


  
  const data = [
    { requestNumber: 1, name: 'Muhammad Sumbul', invoiceNumber: 1, invoiceDate: '2024/05/19', dueDate: '2024/06/19', paymentTerms: 'lagyan ng puday', totalAmount: 1209, status: 'Approved', reason:'Complete Documents'},
    { requestNumber: 44, name: 'Usman Abdal Jaleel Shisha', invoiceNumber: 300, invoiceDate: '2024/05/19', dueDate: '2024/06/19', paymentTerms: 'lagyan ng puday', totalAmount: 1209, status: 'Rejected', reason:'Makapal mukha'},
    { requestNumber: 120, name: 'Khalid Khasmiri', invoiceNumber: 200, invoiceDate: '2024/05/19', dueDate: '2024/06/19', paymentTerms: 'lagyan ng puday', totalAmount: 1209, status: 'Approved', reason:'Complete Documents'},
    // Add more data as needed
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


 
  



  // Handle row click to show modal
  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
  };

  return (

    <>
    
      
      <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Approved/Rejected Payables"
                            columns={columns}
                            data={filteredData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handleRowClick} // Add onRowClicked handler
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
        <dialog id="row_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Details for Request ID: {selectedRowData._id}</h3>
            <div className="py-4">
              <p><strong>Category:</strong> {selectedRowData.category}</p>
              <p><strong>Request Type:</strong> {selectedRowData.typeOfRequest}</p>
              <p><strong>Documents:</strong> {selectedRowData.documents}</p>
              <p><strong>Coments:</strong> {selectedRowData.comments}</p>
              <p><strong>Status:</strong> {selectedRowData.status}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => document.getElementById('row_modal').close()}
            >
              Close
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('row_modal').close()}>
              Close
            </button>
          </form>
        </dialog>
      )}
   </>
  );

    
}



export default approveRejectPayables;
