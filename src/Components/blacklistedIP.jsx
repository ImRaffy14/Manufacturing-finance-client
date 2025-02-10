import React, { useState } from "react";
import DataTable from 'react-data-table-component';

function blacklistedIP() {
  const [searchText, setSearchText] = useState('');

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'User ID', selector: row => row.userId },
    { name: 'Username', selector: row => row.username },
    { name: 'IP Address', selector: row => row.ipAddress },
    { name: 'Ban time', selector: row => row.banTime },
    { name: 'Ban Duration', selector: row => row.banDuration },
    { name: 'Banned', selector: row => row.banned },
    {
      name: 'Actions',
      cell: (row) => (
        <button 
          className="btn btn-outline btn-primary mt-2 mb-2" 
          onClick={() => handleResolveClick(row)}
        >
          Resolve
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
      banTime: 0, 
      banDuration: 0, 
      banned: 'true', 
    },
    {
      _id: 'TX002',
      userId: '2',
      username: 'hahaa',
      ipAddress: '121.212.323',
      banTime: 0, 
      banDuration: 0, 
      banned: 'true', 
    },
    {
      _id: 'TX003',
      userId: '3',
      username: 'hahaa',
      ipAddress: '121.212.323',
      banTime: 0, 
      banDuration: 0, 
      banned: 'true', 
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleResolveClick = (row) => {
    console.log("Resolved Row Data:", row);
  };

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
    </>
  );
}

export default blacklistedIP;
