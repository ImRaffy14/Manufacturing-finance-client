import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_SERVER_URL; //Server url

function ViewAllAccounts({ userData }) {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editData, setEditData] = useState(null); // State to hold editable data
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]); // State to hold table data
  const [invalidChange, setInvalidChange] = useState(false)
  const [password, setPassword] = useState('')
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  


  const socket = useSocket();

  const columns = [
    { name: 'User Image', selector: row => <img src={row.image.secure_url} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '25%', padding: '5%' }} /> },
    { name: 'User ID', selector: row => row._id },
    { name: 'Username', selector: row => row.userName },
    { name: 'Full Name', selector: row => row.fullName },
    { name: 'Email', selector: row => row.email },
    { name: 'Role', selector: row => row.role },
    { name: 'Password', selector: row => row.password },
  ];


  //HANDLES SOCKET REALTIME RENDERING DATA
  useEffect(() => {
    if (!socket) return;

    socket.emit('getAccounts', { msg: 'get accounts' });

    socket.on('receive_accounts', (response) => {
      setTableData(response);
      setIsLoading(false);
    });

    return () => {
      socket.off('receive_accounts'); 
    };
  }, [socket]);


  // HANDLES FOR DATA TABLES
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

  const handleSave = async () => {
    try {

      if(editData === selectedRowData){
          setInvalidChange(true)
        return
      }

      const response = await axios.post(`${API_URL}/API/Account/UpdateAccount`, {
        userId: editData._id,
        userName: editData.userName,
        password: editData.password,
        email: editData.email,
        fullName: editData.fullName,
        role: editData.role
      });

      const updateTrails = {
        userId: userData._id,
        userName: userData.userName,
        role: userData.role,
        action: "UPDATE ACCOUNT INFORMATION",
        description: `Updated an account information for ${selectedRowData.fullName}. ACCOUNT ID: ${selectedRowData._id}`,
  
      };
  
      socket.emit("addAuditTrails", updateTrails);

      toast.success(response.data.message, {
        position: "top-right"
      })
      setInvalidChange(false)
      
    } catch (error) {
      console.error('Error posting data:', error);
    }

    document.getElementById('row_modal').close();
  };


  //HANDLES DELETE
  const handleDelete = async (e) => {
    
  e.preventDefault();
    
   try{

    setIsSubmitLoading(true)
    const response = await axios.post(`${API_URL}/API/Account/DeleteAccount`, {
      userId: selectedRowData._id,
      public_id: selectedRowData.image.public_id,
      userName: userData.userName,
      password: password
      });

      if(response){
        const deleteTrails = {
          userId: userData._id,
          userName: userData.userName,
          role: userData.role,
          action: "DELETE ACCOUNT",
          description: `Deletes account for  ${selectedRowData.fullName}.`,
    
        };
    
        socket.emit("addAuditTrails", deleteTrails);
        toast.success(response.data.message, {
          position: "top-right"
        })

        setIsSubmitLoading(true)
        document.getElementById('row_modal').close();
        document.getElementById('login_modal').close();
      }
   }
   catch(error){
    if(error.response){
      console.log(error.response.data.msg)
      setIsSubmitLoading(false)
    }
    else{
      console.error(error)
      setIsSubmitLoading(false)
    }
   }

  };

  const filteredData = tableData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

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
            <ToastContainer/>
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
            <select
              name="role"
              value={editData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              {/* Placeholder showing the current role */}
              <option value="" disabled>
                {editData.role || 'Select a role'}
              </option>
              {/* Role options */}
              <option value="ADMIN">ADMIN</option>
              <option value="CHIEF FINANCIAL OFFICER">CHIEF FINANCIAL OFFICER</option>
              <option value="FINANCE MANAGER">FINANCE MANAGER</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="FINANCIAL ANALYST">FINANCIAL ANALYST</option>
              <option value="TREASURER">TREASURER</option>
            </select>
          </div>

          {/* Error message for invalid change */}
          {invalidChange && <h1 className='text-red-500 font-medium'>No input changes</h1>}
          </>
        ) : (
          <>
            {/* View Mode */}
            <div >
              <label className="block text-gray-600 font-medium mb-1"><strong>Profile:</strong></label>
              <img
                src={selectedRowData.image.secure_url}
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

{!isEditing && (
  <button
    className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
    onClick={() => document.getElementById('login_modal').showModal()}
  >
    Delete
  </button>
)}

{/* Login Modal */}
<dialog id="login_modal" className="modal">
  <div className="modal-box flex flex-col mr-6">
    <h3 className="font-bold text-lg text-center">Enter Password to Confirm Deletion</h3>

    {/* Login Form */}
    <form className="space-y-4" onSubmit={handleDelete}>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700"
        >
          Confirm Deletion
        </button>
        {isSubmitLoading && 
          <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700"
        >
          <span className="loading loading-spinner loading-md"></span>  
        </button>
        }
        <button
          type="button"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => document.getElementById('login_modal').close()}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>

  <form method="dialog" className="modal-backdrop">
    <button type="button" onClick={() => document.getElementById('login_modal').close()}>
      Close
    </button>
  </form>
</dialog>

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
