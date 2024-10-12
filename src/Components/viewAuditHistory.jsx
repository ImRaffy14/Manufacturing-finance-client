import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';

function viewAuditHistory() {
  const [searchText, setSearchText] = useState('');
  const [trailsData, setTrailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data

  const socket = useSocket();

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'Auditor ID', selector: row => row.auditorId },
    { name: 'Auditor', selector: row => row.auditor },
    { name: 'Invoice ID', selector: row => row.invoiceId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount)},
    ];

  const data = trailsData;

  useEffect(() => {
    if (!socket) return;

    socket.emit('get_audit_history', { msg: 'get audit history' });

    socket.on('receive_audit_history', (response) => {
      setTrailsData(response);
      setIsLoading(false);
    });

    return () => {
      socket.off('receive_audit_history'); // Cleanup listener on component unmount
    };
  }, [socket]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Filter data based on search text
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Handle row click to show modal
  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-[270px] w-full"></div>
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
                title="Audit History"
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
            <h3 className="font-bold text-lg">Details for User: {selectedRowData.userName}</h3>
            <div className="py-4">
              <p><strong>Date & Time:</strong> {selectedRowData.dateTime}</p>
              <p><strong>Auditor ID:</strong> {selectedRowData.auditorId}</p>
              <p><strong>Auditor:</strong> {selectedRowData.auditor}</p>
              <p><strong>Invoice ID:</strong> {selectedRowData.invoiceId}</p>
              <p><strong>Customer Name:</strong> {selectedRowData.customerName}</p>
              <p><strong>Total Ammount:</strong> {formatCurrency(selectedRowData.totalAmount)}</p>
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

export default viewAuditHistory;
