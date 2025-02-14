import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext'
import { toast } from 'react-toastify'

function blacklistedIP() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()

  //CONVERT TIMESTAMP
  function convertTimestamp(msTimestamp) {
    const date = new Date(msTimestamp);

    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const mins = date.getUTCMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${mins}`;

    return `${formattedDate} ${formattedTime} UTC`;
  }

  //CONVERT MS TO MINUTES
  function convertMsToMinutes(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes} min ${seconds} sec`;
}

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


  // FETCH BLACKLISTED DATA
  useEffect(() => {
    if(!socket) return

    socket.emit('get_blacklisted')

    // GET BLACKLISTED DATA
    const handleReceiveBlacklisted = (response) => {
      setIsLoading(false)
      setData(response)
    }

    // HANDLE ERROR FETCHING
    const handleError = (response) => {
      toast.error('Server Internal Error', {
        position: 'top-right'
      })
    }

    // HANDLE SUCCESS FETCHING
    const handleSuccess = (response) => {
      toast.success(response.msg, {
        position: 'top-right'
      })
    }

    socket.on('blacklist_success', handleSuccess)
    socket.on('blacklist_error', handleError)
    socket.on('receive_blacklisted', handleReceiveBlacklisted)

    return () => {
      socket.off("receive_blacklisted")
      socket.off("blacklist_error")
      socket.off("blacklist_success")
    }

  },[socket])
  

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleResolveClick = (row) => {
    socket.emit('resolve_blacklisted', row)
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
