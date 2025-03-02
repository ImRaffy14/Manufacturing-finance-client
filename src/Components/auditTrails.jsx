import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';

function AuditTrails() {
  const [searchText, setSearchText] = useState('');
  const [trailsData, setTrailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const socket = useSocket();

  const columns = [
    { name: 'Date & Time', selector: row => row.dateTime, width: '200px' },
    { name: 'User ID', selector: row => row._id, width: '250px' },
    { name: 'Username', selector: row => row.userName, width: '150px' },
    { name: 'Role', selector: row => row.role, width: '150px' },
    { name: 'Action', selector: row => row.action, width: '300px' },
    { 
      name: 'Description', 
      selector: row => row.description, 
      width: '300px',
      cell: row => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {row.description}
        </div>
      ) 
    },
  ];
  
  const data = trailsData;

  useEffect(() => {
    if (!socket) return;

    socket.emit('getAuditTrails', { msg: 'get audit trails' });

    socket.on('receive_audit_trails', (response) => {
      setTrailsData(response);
      setIsLoading(false);
    });

    return () => {
      socket.off('receive_audit_trails'); 
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
                title="Audit Trails"
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

      {/* DISPLAY ROW DATA */}
      {selectedRowData && (
        <dialog id="row_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Audit Trails Preview</h1>
                  <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Details for User: <strong>{selectedRowData.userName}</strong></h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Date & Time:</strong></p>
                      <p className="text-gray-700">{selectedRowData.dateTime}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>User ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData._id}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Role:</strong></p>
                      <p className="text-gray-700">{selectedRowData.role}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Action:</strong></p>
                      <p className="text-gray-700">{selectedRowData.action}</p>
                    </div>
                    <div className="border-b-2 border-gray-500"></div>
                    <div className="flex justify-center mb-4">
                      <p className="font-medium text-lg"><strong>Description:</strong></p>
                    </div>
                    <div className="flex justify-center mb-4">
                      <p className="text-gray-700 w-full h-28 overflow-y-auto break-words text-center">
                        {selectedRowData.description}
                      </p>
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

export default AuditTrails;
