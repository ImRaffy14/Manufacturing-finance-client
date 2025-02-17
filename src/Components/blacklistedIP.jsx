import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext'
import { toast } from 'react-toastify'

function blacklistedIP({ userData }) {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [password, setPassword] = useState("");
  const [errorVerification, setErrorVerification] = useState('')
  const [isSubmitLoading, setIsSubmitLoading] = useState(true)

  const socket = useSocket();

  function convertTimestamp(msTimestamp) {
    const date = new Date(msTimestamp);
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const mins = date.getUTCMinutes().toString().padStart(2, '0');
    return `${formattedDate} ${hours}:${mins} UTC`;
  }

  function convertMsToMinutes(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  }

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
  };

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'User ID', selector: row => row.userId },
    { name: 'Username', selector: row => row.username },
    { name: 'IP Address', selector: row => row.ipAddress },
    { name: 'Location', selector: row => row.location },
    { name: 'Device Info', selector: row => row.deviceInfo },
    { name: 'Ban time', selector: row => convertTimestamp(row.banTime) },
    { name: 'Ban Duration', selector: row => convertMsToMinutes(row.banDuration) },
    { name: 'Banned', selector: row => row.banned ? 'True' : 'False' },
    {
      name: 'Actions',
      cell: (row) => (
        <button 
          className="btn btn-outline btn-primary mt-2 mb-2" 
          onClick={() => {
            document.getElementById("confirm_modal").showModal();
            setSelectedRowData(row); 
          }}
        >
          Resolve
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];

  useEffect(() => {
    if(!socket) return;
    socket.emit('get_blacklisted');

    const handleReceiveBlacklisted = (response) => {
      setIsLoading(false);
      setData(response);
    }

    const handleError = (response) => {
      setPassword('')
      setIsSubmitLoading(true)
      document.getElementById("confirm_modal").close();
      toast.error('Server Internal Error', { position: 'top-right' });
    }

    const handleSuccess = (response) => {
      setErrorVerification('')
      setPassword('')
      setIsSubmitLoading(true)
      document.getElementById("confirm_modal").close();
      toast.success(response.msg, { position: 'top-right' });
    }

    const handleErrorVerification = (response) => {
      setPassword('')
      setIsSubmitLoading(true)
      setErrorVerification(response.msg)
    }

    socket.on('error_verification', handleErrorVerification)
    socket.on('blacklist_success', handleSuccess);
    socket.on('blacklist_error', handleError);
    socket.on('receive_blacklisted', handleReceiveBlacklisted);

    return () => {
      socket.off("receive_blacklisted");
      socket.off("blacklist_error");
      socket.off("blacklist_success");
      socket.off('error_verification')
    }
  },[socket]);
  
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleResolveClick = (e) => {
    e.preventDefault()
    setIsSubmitLoading(false)
    socket.emit('resolve_blacklisted', { row: selectedRowData, password, userName: userData.userName});
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
                title="Blacklisted IP"
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

      {selectedRowData && (
        <dialog id="row_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Blacklisted IP Details</h1>
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
                      <p className="font-medium"><strong>IP Address:</strong></p>
                      <p className="text-gray-700">{selectedRowData.ipAddress}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Ban Time:</strong></p>
                      <p className="text-gray-700">{selectedRowData.banTime}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Ban Duration:</strong></p>
                      <p className="text-gray-700">{selectedRowData.banDuration}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Banned:</strong></p>
                      <p className="text-gray-700">{selectedRowData.banned ? 'true' : 'false'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Device Info:</strong></p>
                      <p className="text-gray-700">{selectedRowData.deviceInfo}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Location:</strong></p>
                      <p className="text-gray-700">{selectedRowData.location}</p>
                    </div>
                  </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('row_modal').close()}>Close</button>
          </form>
        </dialog>
      )}

<dialog id="confirm_modal" className="modal">
        <div className="modal-box">
          <form className="space-y-4" onSubmit={handleResolveClick} >
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
    </>
  );
}

export default blacklistedIP;
