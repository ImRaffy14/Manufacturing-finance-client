import React, { useState } from "react";
import DataTable from 'react-data-table-component';

function ActiveStaff() {
  const [searchText, setSearchText] = useState('');

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'User ID', selector: row => row.userId },
    { name: 'Username', selector: row => row.username },
    { name: 'IP Address', selector: row => row.ipAddress },
    { name: 'Role', selector: row => row.role },
    { name: 'Date', selector: row => row.date },
    {
      name: 'Disconnect',
      cell: (row) => (
          <button 
            className="btn btn-outline btn-error"
            onClick={() => handleDisconnect(row)}
          >
            Disconnect
          </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
    {
      name: 'Block',
      cell: (row) => (
          <button 
            className="my-2 btn btn-outline btn-error"
            onClick={() => handleBlock(row)}
          >
            Block
          </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];
  
  const data = [
    {
      _id: 'TX001',
      userId: '1',
      username: 'hahaa',
      ipAddress: '121.212.323',
      role: 'Admin', 
      date: '12/12/12'
    },
    {
      _id: 'TX002',
      userId: '2',
      username: 'testUser',
      ipAddress: '192.168.1.1',
      role: 'User', 
      date: '13/12/12'
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleDisconnect = (row) => {
    console.log("Disconnecting Staff:", row);
  };

  const handleBlock = (row) => {
    console.log("Blocking Staff:", row);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="max-w-screen-2xl mx-auto mt-4">
      <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
        <div className="mx-4">
          <div className="overflow-x-auto w-full">
            <DataTable
              title="Blacklisted IP"
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
  );
}

export default ActiveStaff;
