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
import { toast } from 'react-toastify'

function reviewPayables() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [onPorcessSearchText, setOnProcessSearchText] = useState ('');
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [pendingPayablesCount, setPendingPayablesCount] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState(null); 
  const [selectedRowOnProcessData, setSelectedRowOnProcessData] = useState(null); 
  const [typeOfRequest, setTypeOfRequest] = useState('');
  const [totalRequest, setTotalRequest] = useState(0);
  const [documents, setDocuments] = useState(null);
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [data, setData] = useState([]);
  const [response, setResponse] = useState('')
  const [onProcessData, setOnprocessData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const socket = useSocket()

  const formatCurrency = (value) => {
      return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };
  
  const columns = [
    { name: 'Payble ID', selector: row => row._id , width: '250px'},
    { name: 'Request ID', selector: row => row.requestId, width: '250px'},
    { name: 'Department', selector: row => row.department, width: '150px'},
    { name: 'Category', selector: row => row.category, width: '200px' },
    { name: 'Type of Request', selector: row => row.typeOfRequest, width: '150px' },
    { name: 'Documents', selector: row => row.documents, width: '300px' },
    { name: 'Reason', selector: row => row.reason , width: '200px'},
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest), width: '180px'},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'Pending' ? 'red' : 'blue',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) }, 
                             
  ];
  
  const onProcessColumns = [
    { name: 'Payble ID', selector: row => row._id, width: '250px' },
    { name: 'Request ID', selector: row => row.requestId, width: '250px' },
    { name: 'Department', selector: row => row.department, width: '150px' },
    { name: 'Category', selector: row => row.category, width: '200px' },
    { name: 'Type of Request', selector: row => row.typeOfRequest, width: '150px'  },
    { name: 'Documents', selector: row => row.documents, width: '300px' },
    { name: 'Reason', selector: row => row.reason , width: '200px'},
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest), width: '150px'},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'On process' ? 'blue' : 'red',
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
        setData(decryptedData.pendingRequestBudget)
        setOnprocessData(decryptedData.onProcessRequestBudget)
        setAccumulatedAmount(decryptedData.pendingBudgetRequestsCount.totalAmount)
        setPendingPayablesCount(decryptedData.pendingBudgetRequestsCount.totalCount)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if(!socket) return;

    const handlesBudgetReqPending = (response) => {
      setData(response.pendingRequestBudget)
      setOnprocessData(response.onProcessRequestBudget)
      setAccumulatedAmount(response.pendingBudgetRequestsCount.totalAmount)
      setPendingPayablesCount(response.pendingBudgetRequestsCount.totalCount)
    }

    socket.on("receive_budget_request_pending", handlesBudgetReqPending)

    return () => {
      socket.off('receive_budget_request_pending')
    };

  }, [socket])


  //Handles submit
  const submit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("typeOfRequest", "Budget")
    formData.append("totalRequest", totalRequest)
    formData.append("reason", reason)
    formData.append("category", category)
    formData.append("documents", documents)

    setIsSubmitLoading(true)
    
    try{

      const response = await axios.post(`${API_URL}/API/BudgetRequests/AddBudgetRequest`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if(response){
        toast.success(response.data.msg, {
          position: 'top-right'
        })
        setIsSubmitLoading(false)
        setTotalRequest(0)
        setReason("")
        setCategory("")
        setDocuments(null)
        document.getElementById('payable_modal').close()
      }
    }
    catch(error){
      toast.error("Something went wrong", {
        position: 'top-right'
      })
      setIsSubmitLoading(false)
      setIsSubmitLoading(false)
      setTotalRequest(0)
      setReason("")
      setCategory("")
      setDocuments(null)
      document.getElementById('payable_modal').close()
      console.error(error)
    }
  }

  //Handles Search from datatables
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleOnProcessSearch = (event) => {
    setOnProcessSearchText(event.target.value);
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
      value.toString().toLowerCase().includes(onPorcessSearchText.toLowerCase())
    )
  );

  
  const handlePendingRowClick = (row) => {
    navigate('/Dashboard/viewRequestPayable', { state: { rowData: row } });
};

// Handle row click to show modal
const handleRowClick = (row) => {
  setSelectedRowOnProcessData(row);
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

            <div className="items-center justify-center bg-white rounded-lg shadow-xl mt-7 mb-7 border border-gray-300">
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
                                value={onPorcessSearchText}
                                onChange={handleOnProcessSearch}
                                className="mb-2 p-2 border border-gray-400 rounded-lg"
                            />
                            }
                        />
                    </div>
                </div>
            </div>
        </div> 

         {/* Modal for displaying row data */}
      {selectedRowOnProcessData && (
        <dialog id="onprocess_modal" className="modal">
        <div className="modal-box w-full h-full max-w-[1600px]">
        <div className='bg-white p-10'>
      
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Request Payable Preview</h1>
      
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Details for Request ID: {selectedRowOnProcessData._id}</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="font-medium"><strong>Category:</strong></p>
            <p className="text-gray-700">{selectedRowOnProcessData.category}</p>
          </div>
      
          <div className="flex justify-between">
            <p className="font-medium"><strong>Type of Request:</strong></p>
            <p className="text-gray-700">{selectedRowOnProcessData.typeOfRequest}</p>
          </div>

          <div className="flex justify-between">
            <p className="font-medium"><strong>Deparment:</strong></p>
            <p className="text-gray-700">{selectedRowOnProcessData.department}</p>
          </div>
      
          <div className="flex justify-between">
            <p className="font-medium"><strong>Documents:</strong></p>
            <p className="text-blue-700"><a href={selectedRowOnProcessData.documents}>{selectedRowOnProcessData.documents}</a></p>
          </div>
          <iframe 
              src={selectedRowOnProcessData.documents}
              width="100%" 
              height="600px" 
              title="PDF Viewer"
            />
          <div className="flex justify-between">
            <p className="font-medium"><strong>Reason:</strong></p>
            <p className="text-gray-700">{selectedRowOnProcessData.reason || 'KUMAIN NG PUDAY'}</p>
          </div>
      
          <div className="flex justify-between">
            <p className="font-medium"><strong>Total Amount:</strong></p>
            <p className="text-gray-700">₱{selectedRowOnProcessData.totalRequest}</p>
          </div>
      
          <div className="flex justify-between">
            <p className="font-medium"><strong>Status:</strong></p>
            <p className={`text-blue-700 font-bold ${selectedRowOnProcessData?.status}`}>
              {selectedRowOnProcessData?.status}
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
              <p><strong>Payable ID:</strong> {selectedRowOnProcessData._id}</p>
              <p><strong>Status:</strong> {selectedRowOnProcessData.status || ''}</p>
            </div>
          </div>
      
          <div className="mb-4">
            <p><strong>Category:</strong> {selectedRowOnProcessData.category}</p>
            <p><strong>Type of Request:</strong> {selectedRowOnProcessData.typeOfRequest}</p>
            <p><strong>Department:</strong> {selectedRowOnProcessData.department}</p>
            <p><strong>Documents:</strong> {selectedRowOnProcessData.documents}</p>
          </div>
      
          <div className="border-t border-b my-4 py-2">
            <div className="flex justify-between font-semibold">
              <span>Reason</span>
              <span>Total Amount</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>{selectedRowOnProcessData.reason || 'KUMAIN NG PUDAY'}</span>
              <span>₱{selectedRowOnProcessData.totalRequest}</span>
            </div>
          </div>
      
          <div className="text-right font-bold mt-4">
            <p className="text-xl">TOTAL AMOUNT: ₱{selectedRowOnProcessData.totalRequest}</p>
          </div>
        </div>
        </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      )}

       {/* Modal */}
       <dialog id="payable_modal" className="modal">
                <div className="modal-box shadow-xl">

                
                <form onSubmit={submit}>
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
                                type="Number" 
                                value={totalRequest}
                                onChange={(e) => setTotalRequest(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                        <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                    Reason
                                </label>
                                <textarea
                                placeholder="Reason"
                                className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                                id="reason" 
                                type="text"   
                                value={reason}
                                onChange={(e) => setReason(e.target.value)} required></textarea>
                                
                            </div>

                            

                            <div className="w-full">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                    Category
                                </label>
                            <select className="select select-bordered w-full"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                                <option selected>Select Category</option>
                                <option>Operational Expenses</option>
                                <option>Capital Expenditure</option>
                            </select>
                        </div>
                        </div>

                        <div className="w-full">
                          <h1 className="text-lg font-bold mb-2">Documents</h1>
                          <h1 className="italic mb-2 text-red-500">Note: PDF documents maximum of 10MB only .</h1>
                        <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs " onChange={(e) => setDocuments(e.target.files[0])} required />
                            </div>
                        {response && <h1 className="text-red-500 font-bold">{response}</h1>}
                        <div className="w-full">
                            {!isSubmitLoading && <button className="btn btn-primary w-full font-bold">Submit</button>}
                        </div>
                    </div>
                    </form>
                        {isSubmitLoading && <button className="btn btn-primary w-full font-bold"><span className="loading loading-spinner loading-md"></span></button>}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
  
            {/*On process Modal*/}

            

   </>
  );

    
}



export default reviewPayables;
