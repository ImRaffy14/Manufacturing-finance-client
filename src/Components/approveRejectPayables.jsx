import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useSocket } from '../context/SocketContext';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function approveRejectPayables() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null); 
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const socket = useSocket()

  const columns = [
    { name: 'Payable ID', selector: row => row._id, width: '250px' },
    { name: 'Request ID', selector: row => row.requestId, width: '250px' },
    { name: 'Department', selector: row => row.department, width: '150px' },
    { name: 'Category', selector: row => row.category, width: '200px' },
    { name: 'Type of Request', selector: row => row.typeOfRequest, width: '150px'  },
    { name: 'Documents', selector: row => row.documents, width: '300px' },
    { name: 'Reason', selector: row => row.reason , width: '200px'},
    { name: 'Comment', selector: row => row.comment , width: '200px'},
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest), width: '180px'},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'Approved' ? 'green' : 'red',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) },
    
  ];

  

  
  const API_URL = import.meta.env.VITE_SERVER_URL;

  //DECRYPTION
  const decryptData = (encryptedData, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey); 
    const decrypted = bytes.toString(CryptoJS.enc.Utf8); 
    return JSON.parse(decrypted); 
  };

  //FETCHING DATA
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_URL}/API/BudgetRequests/processed`)
      if(response){
        const decryptedData = decryptData(response.data.result, import.meta.env.VITE_ENCRYPT_KEY)
        setData(decryptedData)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if(!socket) return;

    socket.on("receive_budget_request_processed", (response) => {
      setData(response)
    })

  }, [socket])

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
  };

  //LOADER
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
                            title="Approved/Rejected Payables"
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

      {/* MODAL */}
      {selectedRowData && (
        <dialog id="row_modal" className="modal">
          <div className="modal-box w-full max-w-[1400px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Payables Preview</h1>
            <h2 className="text-2xl font-semibold mb-4 mt-10 border-b pb-2 border-gray-300">Details for Payable ID: <strong>{selectedRowData._id}</strong></h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="font-medium"><strong>Category:</strong></p>
                  <p className="text-gray-700">{selectedRowData.category}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium"><strong>Type of Request:</strong></p>
                  <p className="text-gray-700">{selectedRowData.typeOfRequest}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium"><strong>Department:</strong></p>
                  <p className="text-gray-700">{selectedRowData.department}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium"><strong>Status:</strong></p>
                  <p className={`text-gray-700 ${selectedRowData.status === 'Approved' ? 'text-green-500 font-bold' : 'text-red-600 font-bold'}`}>
                    {selectedRowData.status}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium"><strong>Documents:</strong></p>
                  <p className="text-blue-700"><a href={selectedRowData.documents}>{selectedRowData.documents}</a></p>
                </div>
                <iframe 
                    src={selectedRowData.documents}
                    width="100%" 
                    height="600px" 
                    title="PDF Viewer"
                  />
              </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('row_modal').close()}></button>
          </form>
        </dialog>
      )}
   </>
  );

    
}



export default approveRejectPayables;
