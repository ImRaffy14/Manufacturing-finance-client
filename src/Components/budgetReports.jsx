import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext"

function budgetReports() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  // Handle row click to show modal
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const socket = useSocket()

  const columns = [
    { name: 'Transaction ID', selector: row => row._id },
    { name: 'Date & Time', selector: row => row.dateTime, width: '200px' },
    { name: 'Approver', selector: row => row.approver, width: '100px' },
    { name: 'Approver ID', selector: row => row.approverId },
    { name: 'Payable ID', selector: row => row.payableId },
    { name: 'Category', selector: row => row.category },
    { name: 'Department', selector: row => row.department },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount)},  
  ];

  //FETCHING DATA

  useEffect(() => {

    if(!socket) return;

    socket.emit("get_budget_reports", {msg: "get budget reports"})

    const handleBudgetReports = (response) => {
      setData(response)
      setIsLoading(false)
    }

    socket.on("receive_budget_reports", handleBudgetReports)

    return () => {
      socket.off("receive_budget_reports")
    }

  }, [socket])




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

 if (isLoading) {
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
             <div className="modal-box w-full max-w-[1200px] bg-white shadow-lg rounded-lg">
    <div className='rounded-xl shadow-2xl bg-white p-10'>

<h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Budget Preview</h1>

  <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Details for Transaction ID : <strong>{selectedRowData._id}</strong></h2>
  
  <div className="space-y-4">
    <div className="flex justify-between">
      <p className="font-medium"><strong>Date & Time:</strong></p>
      <p className="text-gray-700">{selectedRowData.dateTime}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Approver ID:</strong></p>
      <p className="text-gray-700">{selectedRowData.approverId}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Approver:</strong></p>
      <p className="text-gray-700">{selectedRowData.approver}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Payable ID:</strong></p>
      <p className="text-gray-700">{selectedRowData.payableId}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Category:</strong></p>
      <p className="text-gray-700">{selectedRowData.category}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Department:</strong></p>
      <p className="text-gray-700">{selectedRowData.department}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Total Amount:</strong></p>
      <p className="text-gray-700">{formatCurrency(selectedRowData.totalAmount)}</p>
    </div>

</div>
  </div>
      <div className="mt-6 flex justify-end">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => document.getElementById('row_modal').close()}
        >
          Close
        </button>
      </div>
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
