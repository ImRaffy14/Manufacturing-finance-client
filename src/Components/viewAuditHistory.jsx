import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';

function viewAuditHistory() {
  const [searchText, setSearchText] = useState('');
  const [trailsData, setTrailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null); 

  const socket = useSocket();

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Transaction ID', selector: row => row._id },
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'Auditor ID', selector: row => row.auditorId },
    { name: 'Auditor', selector: row => row.auditor },
    { name: 'P.Order ID', selector: row => row.invoiceId },
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
      socket.off('receive_audit_history');
    };
  }, [socket]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

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

  {/* MODAL FOR ROW DATA DISPLAY */}
  {selectedRowData && (
        <dialog id="row_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Audit Preview</h1>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>P.Order ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData.invoiceId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Date & Time:</strong></p>
                      <p className="text-gray-700">{selectedRowData.dateTime}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Auditor ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData.auditorId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Auditor:</strong></p>
                      <p className="text-gray-700">{selectedRowData.auditor}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Customer Name:</strong></p>
                      <p className="text-gray-700">{selectedRowData.customerName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Total Amount:</strong></p>
                      <p className="text-gray-700">{formatCurrency(selectedRowData.totalAmount)}</p>
                    </div>
                  </div>
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
