
import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { BsCashCoin } from "react-icons/bs";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdContactEmergency } from "react-icons/md";
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../context/SocketContext";
import  axios from "axios";
import CryptoJS from 'crypto-js';
import { GiExpense } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiPiggyBank } from "react-icons/gi";



function budgetRequest() {
  const navigate = useNavigate();
  const [budgetRequest, setBudgetRequest] = useState(0);
  const [operatingExpenses, setOperatingExpenses] = useState(0);
  const [capitalExpenditure, setCapitalExpenditure] = useState (0);
  const [emergencyReserve, setEmergencyReserve] = useState(0);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [searchText, setSearchText] = useState('');
  const [requestId, setRequestId] = useState('');
  const [category, setCategory] = useState('Emergency Reserve');
  const [typeOfRequest, setTypeOfRequest] = useState ('Budget');
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [totalRequest, setTotalRequest] = useState();
  const formatCurrency = (value) => {
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
          setData(decryptedData.onProcessRequestBudget)
          setBudgetRequest(decryptedData.onProcessRequestBudgetCount)
          setIsLoading(false)
        }
      }
      
      fetchData()
    }, [])

  useEffect(() => {
    if(!socket) return;

    socket.emit('get_budget_allocation', {msg: "get budget allocation"})

    const handlesRequestPending = (response) => {
      setData(response.onProcessRequestBudget)
      setBudgetRequest(response.onProcessRequestBudgetCount)
    } 
    
    const handlesBudgetAllocation = (response) => {
      setOperatingExpenses(response.operatingExpenses)
      setCapitalExpenditure(response.capitalExpenditures)
      setEmergencyReserve(response.emergencyReserve)
    }
    
    socket.on("receive_budget_request_pending", handlesRequestPending)
    socket.on("receive_budget_allocation", handlesBudgetAllocation)

    return () => {
      socket.off("receive_budget_request_pending")
      socket.off("receive_budget_allocation")
    }
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

  const handleRowClick = (row) => {
    navigate('/Dashboard/viewBudgetRequest', { state: { rowData: row } });
  };

  //HANDLE EMERGENCY RESERVE SUBMIT
  const handlesSubmit = async (e) => {
    e.preventDefault()
    console.log({ category, reason, typeOfRequest, totalRequest})
  }
  

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
      <div className="max-w-screen-2xl mx-auto mt-[20px]">
        <div className="flex space-x-4">
              {/* Pending Invoice */}
            <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-10 transition-transform transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-semibold text-md">Budget Requests</p>
              </div>
              <div className="flex gap-3 my-3">
              <VscGitPullRequestGoToChanges className="text-blue-600 text-2xl my-2" />
                <p className="text-4xl font-bold">{budgetRequest}</p>
              </div>
            </div>
            <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-10 transition-transform transform hover:scale-105  hover:shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-semibold text-sm">Add Emergency Reserve</p>
                <MdContactEmergency className="text-gray-600 text-xl" />
              </div>
              <div className="flex gap-3 my-3 hover:cursor-pointer"  onClick={() => document.getElementById('budget_modal').showModal()}>
              <FaRegPlusSquare className="text-blue-600 text-2xl my-2" />
                <p className="text-3xl font-bold">Create</p>
              </div>
            </div>
        </div>

        <div className="flex space-x-4 mb-[30px]">
            <div className="flex gap-4">
              {/* Operating Expenses */}
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-5 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-sm">Operating Expenses</p>
                  <GiTakeMyMoney className="text-green-600 text-xl" />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl font-bold">{formatCurrency(operatingExpenses)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {/* Capital Expenditure */}
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-5 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-sm">Capital Expenditure</p>
                  <GiExpense className="text-green-600 text-xl" />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl font-bold">{formatCurrency(capitalExpenditure)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {/* Emergency Reserve */}
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-5 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-sm">Emergency Budget</p>
                  <BsCashCoin className="text-green-600 text-xl" />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl font-bold">{formatCurrency(emergencyReserve)}</p>
                </div>
              </div>
            </div>
        </div>
            
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10">
                  <div className="mx-4">
                      <div className="overflow-x-auto w-full">
                          <DataTable
                              title="Budget Requests"
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


        <dialog id="budget_modal" className="modal">
            <div className="modal-box shadow-xl">
                  <form onSubmit={handlesSubmit}>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="font-bold mb-4 text-lg">CREATE BUDGET</h1>
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
                              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalRequest">
                                  Category
                              </label>
                              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="totalRequest" 
                              type="text" 
                              value='Emergency Reserve'
                              onChange={(e) => setCategory(e.target.value)} required/>
                          </div>
                        </div>
                        <div className="w-full">
                          <button className="btn btn-primary w-full font-bold" onClick={() => document.getElementById('budget_reserve').showModal()}>Submit</button>
                        </div>
                    </div>
                  </form>    
            </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
            
            <dialog id="budget_reserve" className="modal">
        <div className="modal-box">
          <form className="space-y-4" >
              <div>
                <h3 className="font-bold text-lg text-center">Enter Password to Submit Budget</h3>
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
                <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                >
                Submit Budget  
                </button>
          </form>
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog>                  
    </>
  )
}

export default budgetRequest
