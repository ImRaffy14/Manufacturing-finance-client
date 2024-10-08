
import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { BsCashCoin } from "react-icons/bs";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { FaRegPlusSquare } from "react-icons/fa";
import { MdContactEmergency } from "react-icons/md";
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';



function budgetRequest() {
  const navigate = useNavigate();
  const [budgetRequest, setBudgetRequest] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [reason, setReason] = useState('');
  const [searchText, setSearchText] = useState('');
  const [requestId, setRequestId] = useState('');
  const [category, setCategory] = useState('');
  const [typeOfRequest, setTypeOfRequest] = useState ('');
  const [documents, setDocuments] = useState ('');
const [totalRequest, setTotalRequest] = useState(0);
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Payable ID', selector: row => row._id },
    { name: 'Request ID', selector: row => row.requestId },
    { name: 'Category', selector: row => row.category },
    { name: 'Type of Request', selector: row => row.typeOfRequest },
    { name: 'Documents', selector: row => row.documents },
    { name: 'Reason', selector: row => row.reason },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalRequest)},  
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.status === 'On process' ? 'blue' : 'red',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.status}
                                </span>) },
  ];

  const data = [
    {
      _id: 'P001',
      requestId: 'REQ1001',
      category: 'Office Supplies',
      typeOfRequest: 'Purchase',
      documents: 'Invoice123.pdf',
      reason: 'For restocking office supplies',
      totalRequest: 5000.75,
      status: 'On process',
    },
    {
      _id: 'P002',
      requestId: 'REQ1002',
      category: 'Travel Expenses',
      typeOfRequest: 'Reimbursement',
      documents: 'Receipt789.jpg',
      reason: 'Business trip to client site',
      totalRequest: 15000.25,
      status: 'On process',
    },
    {
      _id: 'P003',
      requestId: 'REQ1003',
      category: 'IT Equipment',
      typeOfRequest: 'Purchase',
      documents: 'Quote567.pdf',
      reason: 'Purchase of new laptops for development team',
      totalRequest: 80000.00,
      status: 'On process',
    },
  ];

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
  
  return (
    <>
    

    <div className="max-w-screen-2xl mx-auto mt-[20px]">
  
    <div className="flex space-x-4 mb-[20px]">
            {/* Pending Invoice */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Budget Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <VscGitPullRequestGoToChanges className="text-blue-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{budgetRequest}</p>
            </div>
          </div>

          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Total Cash</p>
            </div>
            <div className="flex gap-3 my-3">
            <BsCashCoin className="text-green-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{formatCurrency(totalCash)}</p>
            </div>
          </div>

          <div className="bg-white shadow-lg w-[320px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105  hover:shadow-xl">
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
          
          <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
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

                
                <form>
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
                                onChange={(e) => setTotalRequest(e.target.value)} required/>
                            </div>

                        </div>

                        <div className="w-full">
                          <button className="btn btn-primary w-full font-bold">Submit</button>
                        </div>
                    </div>
                    </form>
                        
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
    
    </>
  )
}

export default budgetRequest
