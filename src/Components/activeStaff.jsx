import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { VscDebugDisconnect } from "react-icons/vsc";
import { MdBlock } from "react-icons/md";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify"


function ActiveStaff() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket()

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
          onClick={() => handleDisconnect(row)}
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
          onClick={() => handleBlock(row)}
        >
          <MdBlock size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
  ];
  

  // FETCHING ACTIVE STAFF DATA
  useEffect(() => {
    if(!socket) return

    socket.emit('get_active_staff')

    // RECEIVE ACTIVE STAFF
    const receiveActiveStaff = (response) => {
      setIsLoading(false)
      setData(response)
    }
    
    // HANDLE ERROR
    const handleError = (response) => {
      toast.error('Server Internal Error', {
        positon: 'top-right'
      })
    }

    // HANDLE SUCCESS FETCHING
    const handleSuccessFetch = (response) => {
      toast.success(response.msg, {
        position: 'top-right'
      })
    }

    socket.on('active_staff_success', handleSuccessFetch)
    socket.on('active_staff_error', handleError)
    socket.on('receive_active_staff', receiveActiveStaff)

    return () => {
      socket.off('receive_active_staff')
      socket.off('active_staff_error')
      socket.off('active_staff_success')
    }

  }, [socket])


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleDisconnect = (row) => {
    socket.emit('force_disconnect_staff', row)
  };

  const handleBlock = (row) => {
    socket.emit('block_ip_address', row)
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // LOADER
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
    <div className="max-w-screen-2xl mx-auto mt-4">
      <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
        <div className="mx-4">
          <div className="overflow-x-auto w-full">
            <DataTable
              title="Active Staff"
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
