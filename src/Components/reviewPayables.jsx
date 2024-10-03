import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { MdOutlinePayments } from "react-icons/md";
import { TbCreditCardPay } from "react-icons/tb";
import { FaRegPlusSquare } from "react-icons/fa";
import { useSocket } from "../context/SocketContext"
import CryptoJS from 'crypto-js';
import axios from 'axios';

function reviewPayables() {
  const [searchText, setSearchText] = useState('');
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [pendingPayablesCount, setPendingPayablesCount] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState(null); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null)
  const [data, setData] = useState([])
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()

  const formatCurrency = (value) => {
      return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };
  
  const columns = [
    { name: 'Request ID', selector: row => row._id },
    { name: 'Invoice Number', selector: row => row.category },
    { name: 'Invoice Date', selector: row => row.reason },
    { name: 'DueDate', selector: row => row.documents },
    { name: 'Payment Terms', selector: row => row.comments },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'Pending' ? 'red' : 'inherit',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) },
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
      const response = await axios.get(`${API_URL}/API/BudgetRequests`)
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
      <div className="flex space-x-4 mb-[20px]">

{/* Pending Invoice */}
 <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
   <div className="flex items-center justify-between">
     <p className="text-gray-600 font-semibold text-md">Pending Payables</p>
   </div>
   <div className="flex gap-3 my-3">
   <TbCreditCardPay className="text-blue-600 text-2xl my-2" />
     <p className="text-4xl font-bold">{pendingPayablesCount}</p>
   </div>
 </div>

<div className="bg-white shadow-lg w-[320px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
   <div className="flex items-center justify-between">
     <p className="text-gray-600 font-semibold text-sm">Accumulated Amount</p>
     <GrMoney className="text-yellow-500 text-xl" />
   </div>
   <div className="flex gap-3 my-3">
     <p className="text-3xl font-bold">{formatCurrency(accumulatedAmount)}</p>
   </div>
 </div>

 <div className="bg-white shadow-lg w-[320px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105  hover:shadow-xl">
   <div className="flex items-center justify-between">
     <p className="text-gray-600 font-semibold text-sm">Add Payable</p>
     <IoCreateOutline className="text-gray-600 text-xl" />
   </div>
   <div className="flex gap-3 my-3 hover:cursor-pointer"  onClick={() => document.getElementById('payable_modal').showModal()}>
   <FaRegPlusSquare className="text-blue-600 text-2xl my-2" />
     <p className="text-3xl font-bold">Create</p>
   </div>
 </div>

</div>
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Review Payables"
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
            <h3 className="font-bold text-lg">Details for Supplier ID: {selectedRowData.supplierNumber}</h3>
            <div className="py-4">
              <p><strong>Invoice Number:</strong> {selectedRowData.invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> {selectedRowData.invoiceDate}</p>
              <p><strong>Due Date:</strong> {selectedRowData.dueDate}</p>
              <p><strong>Total Amount:</strong> {selectedRowData.totalAmount}</p>
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

       {/* Modal */}
       <dialog id="payable_modal" className="modal">
                <div className="modal-box shadow-xl">

                
                <form >
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="font-bold mb-4 text-lg">CREATE PAYABLE</h1>

                        <div className="flex gap-4 w-full">
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"
                                type="text" 
                                placeholder="Username"
                                value={username}
                                required />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" 
                                type="password" 
                                placeholder="******************" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" 
                                type="email" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} required/> 
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="name" 
                                type="text" 
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} required/> 
                            </div>
                        </div>

                        <div className="mt-2 w-full flex">
                            <select className="select select-bordered w-[230px]"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}>
                                <option selected>Select Category</option>
                                <option>Operational Expenses</option>
                                <option>Capital Expenditure</option>
                            </select>
                        </div>

                        <div className="w-full">
                        <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs " onChange={(e) => setImage(e.target.files[0])} required />
                            </div>
                        {response && <h1 className="text-red-500 font-bold">{response}</h1>}
                        <div className="w-full">
                            {!isLoading && <button className="btn btn-primary w-full font-bold">Submit</button>}
                        </div>
                    </div>
                    </form>
                        {isLoading && <button className="btn btn-primary w-full font-bold"><span className="loading loading-spinner loading-md"></span></button>}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
   </>
  );

    
}



export default reviewPayables;
