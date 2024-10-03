import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";
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
      return `₱0.00`; // or return an appropriate placeholder
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const socket = useSocket()

  const columns = [
    { name: 'Request ID', selector: row => row._id },
    { name: 'Category', selector: row => row.category },
    { name: 'Type of Request', selector: row => row.typeOfRequest },
    { name: 'Documents', selector: row => row.documents },
    { name: 'Commets', selector: row => row.comments || 'Burat'},
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},
    { name: 'Status',
                    selector: row => (
                      <span style={{ 
                        color: row.status === 'Rejected' ? 'red' : row.status === 'Approved' ? 'green' : 'red',
                        fontWeight: 'bold' 
                      }}>
                        {row.status}
                      </span>)
                      },
    
  ];

  
  const API_URL = import.meta.env.VITE_SERVER_URL;

  //DECRYPTION
  const decryptData = (encryptedData, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey); // Decrypt the data
    const decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to string
    return JSON.parse(decrypted); // Parse the decrypted string into JSON
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


  }, [socket])


  //Handles search from datatables
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
            <h3 className="font-bold text-lg">Details for Request ID: {selectedRowData._id}</h3>
            <div className="py-4">
              <p><strong>Category:</strong> {selectedRowData.category}</p>
              <p><strong>Request Type:</strong> {selectedRowData.typeOfRequest}</p>
              <p><strong>Documents:</strong> {selectedRowData.documents}</p>
              <p><strong>Coments:</strong> {selectedRowData.comments}</p>
              <p><strong>Status:</strong> {selectedRowData.status}</p>
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
  );

    
}



export default approveRejectPayables;
