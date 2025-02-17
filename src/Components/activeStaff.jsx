import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { VscDebugDisconnect } from "react-icons/vsc";
import { MdBlock } from "react-icons/md";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

function ActiveStaff({ userData }) {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [password, setPassword] = useState("");
  const [errorVerification, setErrorVerification] = useState('')
  const [isSubmitLoading, setIsSubmitLoading] = useState(true)

  const socket = useSocket();

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'User ID', selector: row => row.userId },
    { name: 'Username', selector: row => row.username },
    { name: 'IP Address', selector: row => row.ipAddress },
    { name: 'Location', selector: row => row.location },
    { name: 'Device Info', selector: row => row.deviceInfo },
    { name: 'Socket ID', selector: row => row.socketId },
    { name: 'Role', selector: row => row.role },
    { name: 'Date', selector: row => row.date },
    {
      name: 'Disconnect',
      cell: (row) => (
        <button 
          className="btn btn-outline btn-error p-2 mt-2 mb-2"
          onClick={() => {
            document.getElementById("confirm_modal_dc").showModal();
            setSelectedRowData(row); 
          }}
        >
          <VscDebugDisconnect size={20} />
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
          className="btn btn-outline btn-error p-2 mt-2 mb-2"
          onClick={() => {
            document.getElementById("confirm_modal_bl").showModal();
            setSelectedRowData(row);
          }}
        >
          <MdBlock size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
  ];

  useEffect(() => {
    if (!socket) return;

    socket.emit('get_active_staff');

    const receiveActiveStaff = (response) => {
      setIsLoading(false);
      setData(response);
    };

    const handleError = () => {
      setErrorVerification('')
      setPassword('')
      setIsSubmitLoading(true)
      document.getElementById("confirm_modal_dc").close();
      document.getElementById("confirm_modal_bl").close();
      toast.error('Server Internal Error', { position: 'top-right' });
    };

    const handleSuccessFetch = (response) => {
      setErrorVerification('')
      setPassword('')
      setIsSubmitLoading(true)
      document.getElementById("confirm_modal_dc").close();
      document.getElementById("confirm_modal_bl").close();
      toast.success(response.msg, { position: 'top-right' });
    };

    const handleErrorVerification = (response) => {
      setPassword('')
      setIsSubmitLoading(true)
      setErrorVerification(response.msg)
    }

    socket.on('error_verification', handleErrorVerification)
    socket.on('active_staff_success', handleSuccessFetch);
    socket.on('active_staff_error', handleError);
    socket.on('receive_active_staff', receiveActiveStaff);

    return () => {
      socket.off('receive_active_staff');
      socket.off('active_staff_error');
      socket.off('active_staff_success');
      socket.off('error_verification')
    };
  }, [socket]);


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
  };

  const handleDisconnect = (e) => {
    e.preventDefault()
    setIsSubmitLoading(false)
    socket.emit('force_disconnect_staff', { row: selectedRowData, password, userName: userData.userName});
  };

  const handleBlock = (e) => {
    e.preventDefault()
    setIsSubmitLoading(false)
    socket.emit('block_ip_address', { row: selectedRowData, password, userName: userData.userName});
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-[520px] w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto mt-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-300">
        <div className="mx-4">
          <div className="overflow-x-auto w-full">
            <DataTable
              title="Active Staff"
              columns={columns}
              data={filteredData}
              pagination
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

      {selectedRowData && (
        <dialog id="row_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">User Info</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData._id}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>User ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData.userId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Username:</strong></p>
                      <p className="text-gray-700">{selectedRowData.username}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Role:</strong></p>
                      <p className="text-gray-700">{selectedRowData.role}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>IP Address:</strong></p>
                      <p className="text-gray-700">{selectedRowData.ipAddress}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Date:</strong></p>
                      <p className="text-gray-700">{selectedRowData.date}</p>
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

    {/* PASSWORD VERIFICATION FOR DISCONNECTION */}
    <dialog id="confirm_modal_dc" className="modal">
        <div className="modal-box">
          <form className="space-y-4" onSubmit={handleDisconnect}>
              <div>
                <h3 className="font-bold text-lg text-center">Enter Password to Proceed</h3>
                  <label className="block text-gray-600 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
                {errorVerification && <h1 className="text-red-500">{errorVerification}</h1>}
                
                {isSubmitLoading && 
                  <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800" type="Submit"
                  >
                  Confirm Password  
                  </button>
                }

                {!isSubmitLoading && 
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 mt-4 w-[140px]">
                    <span className="loading loading-spinner loading-sm"></span>
                  </button>
                }
    
          </form>
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog> 
    
    {/* PASSWORD VERIFCATION FOR BLOCKING */}
    <dialog id="confirm_modal_bl" className="modal">
        <div className="modal-box">
          <form className="space-y-4" onSubmit={handleBlock}>
              <div>
                <h3 className="font-bold text-lg text-center">Enter Password to Proceed</h3>
                  <label className="block text-gray-600 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              {errorVerification && <h1 className="text-red-500">{errorVerification}</h1>}

              {isSubmitLoading && 
                  <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800" type="submit"
                  >
                  Confirm Password  
                  </button>
                }

                {!isSubmitLoading && 
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 mt-4 w-[140px]">
                    <span className="loading loading-spinner loading-sm"></span>
                  </button>
                }
    
          </form>
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog> 
    </div>
  );
}

export default ActiveStaff;
