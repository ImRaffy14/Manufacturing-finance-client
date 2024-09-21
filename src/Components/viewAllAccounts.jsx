import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';

function ViewAllAccounts() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editData, setEditData] = useState(null); // State to hold editable data
  const [tableData, setTableData] = useState([

    { _id: 1, image: 'https://randomuser.me/api/portraits/men/1.jpg', userName: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', fullName: 'Akhmed Marumbul', role: 'Doctor' },
    { _id: 2, image: 'https://randomuser.me/api/portraits/men/1.jpg', userName: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', fullName: 'Akhmed Marumbul', role: 'Doctor' },
    { _id: 3, image: 'https://randomuser.me/api/portraits/men/1.jpg', userName: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', fullName: 'Akhmed Marumbul', role: 'Doctor' },
  ]); // State to hold table data

  const socket = useSocket();

  const columns = [
    { name: 'User ID', selector: row => row._id },
    { name: 'Image', selector: row => <img src={row.image} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '25%', padding: '5%' }} /> },
    { name: 'Username', selector: row => row.userName },
    { name: 'Password', selector: row => row.password },
    { name: 'Email', selector: row => row.email },
    { name: 'Full Name', selector: row => row.fullName },
    { name: 'Role', selector: row => row.role },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    setEditData(row); 
    setIsEditing(false); 
    document.getElementById('row_modal').showModal();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    const updatedData = tableData.map(row => (row._id === editData._id ? editData : row));
    setTableData(updatedData);
    document.getElementById('row_modal').close();
  };

  const handleDelete = () => {
    const updatedData = tableData.filter(row => row._id !== selectedRowData._id);
    setTableData(updatedData);
    document.getElementById('row_modal').close();
  };

  const filteredData = tableData.filter(row =>
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

     {/* Modal for displaying and editing row data */}
{selectedRowData && (
  <dialog id="row_modal" className="modal">
    <div className="modal-box p-6 bg-white rounded-lg shadow-lg w-full max-w-lg">
      <h3 className="font-bold text-xl text-gray-800 mb-4">
        Details for User: {selectedRowData.userName}
      </h3>

      <div className="py-4 space-y-3">
        {isEditing ? (
          <>
            {/* Edit Mode */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Full Name:</label>
              <input
                name="fullName"
                value={editData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Username:</label>
              <input
                name="userName"
                value={editData.userName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Password:</label>
              <input
                name="password"
                type="password"
                value={editData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Email:</label>
              <input
                name="email"
                type="email"
                value={editData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Role:</label>
              <input
                name="role"
                value={editData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            {/* View Mode */}
            <div >
              <label className="block text-gray-600 font-medium mb-1"><strong>Profile:</strong></label>
              <img
                src={selectedRowData.image}
                alt="User profile"
                className="w-24 h-24 rounded-full border border-gray-300"
              />
            </div>
            <div>
              <p><strong>Full Name:</strong> {selectedRowData.fullName}</p>
            </div>
            <div>
              <p><strong>Username:</strong> {selectedRowData.userName}</p>
            </div>
            <div>
              <p><strong>Password:</strong> {selectedRowData.password}</p>
            </div>
            <div>
              <p><strong>Email:</strong> {selectedRowData.email}</p>
            </div>
            <div>
              <p><strong>Role:</strong> {selectedRowData.role}</p>
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          className={`px-4 py-2 font-medium text-white rounded ${isEditing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={handleEditToggle}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>

        {isEditing && (
          <button
            className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700"
            onClick={handleSave}
          >
            Save
          </button>
        )}

        <button
          className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          className="px-4 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-700"
          onClick={() => document.getElementById('row_modal').close()}
        >
          Close
        </button>
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

export default ViewAllAccounts;
