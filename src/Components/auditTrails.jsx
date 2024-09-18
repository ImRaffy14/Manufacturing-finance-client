import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext'

function auditTrails() {
    const [searchText, setSearchText] = useState('');
    const [trailsData, setTrailsData] = useState ([])
    const [isLoading, setIsLoading] = useState(true)

    const socket = useSocket()
    
    const columns = [
        { name: 'Date & Time', selector: row => row.dateTime },
        { name: 'User ID', selector: row => row._id },
        { name: 'Username', selector: row => row.userName },
        { name: 'Role', selector: row => row.role },
        { name: 'Action', selector: row => row.action },
        { name: 'Description', selector: row => row.description },
      ];
      
      const data = trailsData

      useEffect(() => {

        if(!socket) return;
      
        socket.emit('getAuditTrails',{msg: 'get audit trails'})
    
        socket.on("receive_audit_trails", (response) => {
          setTrailsData(response)
          setIsLoading(!isLoading)
        })
        
      }, [socket])
      
      const handleSearch = (event) => {
        setSearchText(event.target.value);
      };
    
      // Filter data based on search text
      const filteredData = data.filter(row =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
    
      if(isLoading){
        return <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-[270px] w-full"></div>
        <div className="skeleton h-20 w-full"></div>
        <div className="skeleton h-20 w-full"></div>
        <div className="skeleton h-20 w-full"></div>
      </div>
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

  )
}

export default auditTrails
