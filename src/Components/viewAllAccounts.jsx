import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';

function viewAllAccounts() {
    const [searchText, setSearchText] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
    const socket = useSocket()
    
    const columns = [
        { name: 'Username', selector: row => row.username },
        { name: 'Password', selector: row => row.password },
        { name: 'Email', selector: row => row.email },
        { name: 'Full Name', selector: row => row.name },
        { name: 'Role', selector: row => row.role },
      ];
      
      const data = [
        { username: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', name: 'Edinburgh', role: 'Doctor'},
        { username: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', name: 'Edinburgh', role: 'Doctor'},
        { username: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', name: 'Edinburgh', role: 'Doctor'},
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
                            title="Accounts List"
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
              <p><strong>Full Name:</strong> {selectedRowData.name}</p>
              <p><strong>Username</strong> {selectedRowData.username}</p>
              <p><strong>Password:</strong> {selectedRowData.password}</p>
              <p><strong>Email:</strong> {selectedRowData.email}</p>
              <p><strong>Role:</strong> {selectedRowData.role}</p>
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

  )
}

export default viewAllAccounts
