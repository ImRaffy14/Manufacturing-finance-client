import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import JJM from '../assets/JJM.jfif';

function reviewPayables() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [pendingPayablesCount, setPendingPayablesCount] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState(null); 
  const [selectedRowOnProcessData, setSelectedRowOnProcessData] = useState(null); 
  const [typeOfRequest, setTypeOfRequest] = useState('');
  const [totalRequest, setTotalRequest] = useState('');
  const [documents, setDocuments] = useState('');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [data, setData] = useState([]);
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()

  const formatCurrency = (value) => {
      return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };
  
  const columns = [
    { name: 'Payble ID', selector: row => row._id },
    { name: 'Request ID', selector: row => row.requestId || 'Burat' },
    { name: 'Category', selector: row => row.category },
    { name: 'Type of Request', selector: row => row.typeOfRequest },
    { name: 'Documents', selector: row => row.documents },
    { name: 'Reason', selector: row => row.reason || 'Burat'},
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'Pending' ? 'red' : 'blue',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) },
                             
  ];
  
  const onProcessColumns = [
    { name: 'Payble ID', selector: row => row._id },
    { name: 'Request ID', selector: row => row.requestId || 'Burat' },
    { name: 'Category', selector: row => row.category },
    { name: 'Type of Request', selector: row => row.typeOfRequest },
    { name: 'Documents', selector: row => row.documents },
    { name: 'Reason', selector: row => row.reason || 'Burat'},
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'On Process' ? 'blue' : 'red',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) },
                             
  ];

  const onProcessData = [
    { _id: 1, requestId: 1, category: 'Burarrat', typeOfRequest: 'Edinburgh', documents: 'Suka, tubig, patis', reason: 'burat', totalRequest: 121212, status: 'On Process' },
    { _id: 1, requestId: 1, category: 'Burarrat', typeOfRequest: 'Edinburgh', documents: 'Suka, tubig, patis', reason: 'burat', totalRequest: 121212, status: 'On Process' },
    { _id: 1, requestId: 1, category: 'Burarrat', typeOfRequest: 'Edinburgh', documents: 'Suka, tubig, patis', reason: 'burat', totalRequest: 121212, status: 'On Process' },
    // Add more data as needed
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
        setData(decryptedData.pendingRequestBudget)
        setAccumulatedAmount(decryptedData.pendingBudgetRequestsCount.totalAmount)
        setPendingPayablesCount(decryptedData.pendingBudgetRequestsCount.totalCount)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if(!socket) return;


  }, [socket])


  //Handles Search from datatables
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Filter data based on search text
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

   // Filter data based on search text
   const filteredOnProcessData = onProcessData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  
  const handlePendingRowClick = (row) => {
    navigate('/Dashboard/viewRequestPayable', { state: { rowData: row } });
};

// Handle row click to show modal
const handleRowClick = (row) => {
  setSelectedRowData(row);
  document.getElementById('onprocess_modal').showModal();
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
                            title="Pending Payables"
                            columns={columns}
                            data={filteredData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handlePendingRowClick} // Add onRowClicked handler
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

            <div className="items-center justify-center bg-white rounded-lg shadow-xl mt-10 border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="On Process Payables"
                            columns={onProcessColumns}
                            data={filteredOnProcessData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handleRowClick}// Add onRowClicked handler
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="typeOfRequest">
                                    Request Type
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="typeOfRequest"
                                type="text" 
                                placeholder="Request Type"
                                value='Budget'
                                readOnly
                                onChange={(e) => setTypeOfRequest(e.target.value)}
                                   />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalRequest">
                                    Total Amount
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="totalRequest" 
                                type="number" 
                                value={totalRequest}
                                onChange={(e) => setTotalRequest(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                    Reason
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="reason" 
                                type="text"   
                                value={reason}
                                onChange={(e) => setReason(e.target.value)} required/> 
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documents">
                                    Documents
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="documents" 
                                type="documents" 
                                value={documents}
                                onChange={(e) => setDocuments(e.target.value)} required/> 
                            </div>
                        </div>

                        <div className="mt-2 w-full flex">
                            <select className="select select-bordered w-[230px]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                                <option selected>Select Category</option>
                                <option>Operational Expenses</option>
                                <option>Capital Expenditure</option>
                            </select>
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

            {/*On process Modal*/}
<dialog id="onprocess_modal" className="modal">
  <div className="modal-box w-full h-full max-w-[1600px]">
  <div className='bg-white p-10'>

<h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Request Payable Preview</h1>

  <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Details for Request ID: {onProcessData._id}</h2>
  
  <div className="space-y-4">
    <div className="flex justify-between">
      <p className="font-medium"><strong>Category:</strong></p>
      <p className="text-gray-700">{onProcessData.category}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Type of Request:</strong></p>
      <p className="text-gray-700">{onProcessData.typeOfRequest}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Documents:</strong></p>
      <p className="text-blue-700"><a href={onProcessData.documents}>{onProcessData.documents}</a></p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Reason:</strong></p>
      <p className="text-gray-700">{onProcessData.reason || 'KUMAIN NG PUDAY'}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Total Amount:</strong></p>
      <p className="text-gray-700">₱{onProcessData.totalRequest}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Status:</strong></p>
      <p className={`text-gray-700 ${onProcessData.status === 'Pending' ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}`}>
        {onProcessData.status}
      </p>
    </div>
</div>

{/* Invoice-style Preview below */}
  <div className="w-full mx-auto mt-8 bg-white p-6 border shadow-md" id="
  payable-preview">
    <div className="flex justify-between items-center mb-4">
      <div>
        <img src={JJM} className="h-20 w-20"/>
      </div>
      <div className="text-right">
        <h3 className="text-lg font-bold">Payable</h3>
        <p><strong>Payable ID:</strong> {onProcessData._id}</p>
        <p><strong>Status:</strong> {onProcessData.status || 'On Process'}</p>
      </div>
    </div>

    <div className="mb-4">
      <p><strong>Category:</strong> {onProcessData.category}</p>
      <p><strong>Type of Request:</strong> {onProcessData.typeOfRequest}</p>
      <p><strong>Documents:</strong> {onProcessData.documents}</p>
    </div>

    <div className="border-t border-b my-4 py-2">
      <div className="flex justify-between font-semibold">
        <span>Reason</span>
        <span>Total Amount</span>
      </div>
      <div className="flex justify-between mt-2">
        <span>{onProcessData.reason || 'KUMAIN NG PUDAY'}</span>
        <span>₱{onProcessData.totalRequest}</span>
      </div>
    </div>

    <div className="text-right font-bold mt-4">
      <p className="text-xl">TOTAL AMOUNT: ₱{onProcessData.totalRequest}</p>
    </div>
  </div>
  </div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

   </>
  );

    
}



export default reviewPayables;
