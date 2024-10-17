import React from 'react'
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';   
import JJM  from '../assets/JJM.jfif'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSocket } from '../context/SocketContext'

function ViewRequestPayable({ userData }) {

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [status, setStatus] = useState("")
  const [comment, setComment] = useState("")
  const [required, setRequired] = useState(false)
  const socket = useSocket()
  const location = useLocation();
  const { rowData } = location.state || {};
        if (!rowData) {
          return <p>No data available.</p>;
        }
  const formatCurrency = (value) => {
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        };      
  const API_URL = import.meta.env.VITE_SERVER_URL;

  //HANDLES PROCESS BUDGET
  const handleProcess = async () => {

    try{

      setIsLoading(true)

      const submitData = {
        _id: rowData._id,
        requestId: rowData.requestId,
        department: rowData.department,
        typeOfRequest: rowData.typeOfRequest,
        category: rowData.category,
        reason: rowData.reason,
        totalRequest: rowData.totalRequest,
        documents: rowData.documents,
        status: "On process",
        comment: "Your request for budget is now on process",
      }
      
      const response = await axios.post(`${API_URL}/API/BudgetRequests/UpdateRequest`, submitData);
      if(response){
        toast.success(response.data.msg, {
          position: "top-right"
        });

        setIsLoading(false)
        setIsSubmitted(!isSubmitted)
        setStatus("Submitted")
        document.getElementById("approve_modal").close()

        const invoiceTrails = {
          userId: userData._id,
          userName: userData.userName,
          role: userData.role,
          action: "APPROVED BUDGET REQUEST TO PROCESS",
          description: `${userData.userName} approved the budget request for ${submitData.department} to process it to the budgeting management. Request ID: ${submitData.requestId} Payable ID: ${submitData._id}`,
        };
    
        socket.emit("addAuditTrails", invoiceTrails);

      }

    }
    catch(err){
      if(err.response){
        toast.error(err.response.data.msg, {
          position: "top-right"
        });

        setIsLoading(false)
        document.getElementById("approve_modal").close()
      }
      else{
        toast.error("Server Error", {
          position: "top-right"
        });
        setIsLoading(false)
      }
    }
  }

  //HANDLES DECLINE BUDGETS
  const handleDecline = async () =>{

    try{
      if(comment === ""){
        setRequired(true)
        return
      }

      const submitData = {
        _id: rowData._id,
        requestId: rowData.requestId,
        department: rowData.department,
        typeOfRequest: rowData.typeOfRequest,
        category: rowData.category,
        reason: rowData.reason,
        totalRequest: rowData.totalRequest,
        documents: rowData.documents,
        status: "Declined",
        comment: comment,
      }

      const response = await axios.post(`${API_URL}/API/BudgetRequests/UpdateRequest`, submitData);
      if(response){
        toast.success(`Budget Request from ${submitData.department} is Declined`, {
          position: "top-right"
        });

        setIsLoading(false)
        setIsSubmitted(!isSubmitted)
        setStatus("Declined")
        document.getElementById("decline_modal").close()

        const invoiceTrails = {
          userId: userData._id,
          userName: userData.userName,
          role: userData.role,
          action: "DECLINED BUDGET REQUEST",
          description: `${userData.userName} declined the budget request for ${submitData.department} with the reason of ${submitData.comment} Request ID: ${submitData.requestId} Payable ID: ${submitData._id}`,
        };
    
        socket.emit("addAuditTrails", invoiceTrails);

      }
    }
    catch(err){
      if(err.response){
        toast.error(err.response.data.msg, {
          position: "top-right"
        });

        setIsLoading(false)
        document.getElementById("decline_modal").close()
      }
      else{
        toast.error("Server Error", {
          position: "top-right"
        });
        setIsLoading(false)
      }
    }
  }

  return (
  <>
    <div className="max-w-screen-2xl mx-auto mt-8  mb-10">
      <div className="breadcrumbs text-xl mt-4">
        <ul>
          <li><a> <Link to="/Dashboard/reviewPayables">Return</Link></a></li>
          <li><a className='text-blue-500 underline'>Documents</a></li>  
        </ul>
      </div>
      <div className='rounded-xl shadow-2xl bg-white p-10'>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Request Payable Preview</h1>
        <h2 className="text-2xl font-semibold mb-4 mt-10 border-b pb-2 border-gray-300">Details for Request ID  : <strong>{rowData.requestId}</strong></h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium"><strong>Category:</strong></p>
              <p className="text-gray-700">{rowData.category}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium"><strong>Type of Request:</strong></p>
              <p className="text-gray-700">{rowData.typeOfRequest}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium"><strong>Department:</strong></p>
              <p className="text-gray-700">{rowData.department}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium"><strong>Documents:</strong></p>
              <p className="text-blue-700"><a href={rowData.documents}>{rowData.documents}</a></p>
            </div>
            <iframe 
                src={rowData.documents}
                width="100%" 
                height="600px" 
                title="PDF Viewer"
              />
            <div className="flex justify-between">
              <p className="font-medium"><strong>Reason:</strong></p>
              <p className="text-gray-700">{rowData.reason}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium"><strong>Total Amount:</strong></p>
              <p className="text-gray-700">{formatCurrency(rowData.totalRequest)}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium"><strong>Status:</strong></p>
              <p className={`text-gray-700 ${rowData.status === 'Pending' ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}`}>
                {rowData.status}
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
              <p><strong>Payable ID:</strong> {rowData._id}</p>
              <p><strong>Status:</strong> {rowData.status || 'Pending'}</p>
            </div>
          </div>
          <div className="mb-4">
            <p><strong>Category:</strong> {rowData.category}</p>
            <p><strong>Type of Request:</strong> {rowData.typeOfRequest}</p>
            <p><strong>Department:</strong> {rowData.department}</p>
            <p><strong>Documents:</strong> {rowData.documents}</p>
          </div>
          <div className="border-t border-b my-4 py-2">
            <div className="flex justify-between font-semibold">
              <span>Reason</span>
              <span>Total Amount</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>{rowData.reason || 'KUMAIN NG PUDAY'}</span>
              <span>{formatCurrency(rowData.totalRequest)}</span>
            </div>
          </div>
          <div className="text-right font-bold mt-4">
            <p className="text-xl">TOTAL AMOUNT:{formatCurrency(rowData.totalRequest)}</p>
          </div>
        </div>

          <div className="flex items-center justify-center mt-4 gap-10">
          {!isSubmitted && <button className="btn btn-lg bg-green-400 hover:bg-green-700" onClick={() => document.getElementById("approve_modal").showModal()}>Process</button>}
          {!isSubmitted && <button className="btn btn-lg bg-red-400 hover:bg-red-700" onClick={() => document.getElementById("decline_modal").showModal()}>Decline</button>}
          {isSubmitted && <h1 className={`font-bold text-xl ${status === "Submitted" ? 'text-green-700' : 'text-red-700'}`}>{status}</h1>}
          </div>
        </div>
    </div>

    {/* Approve Modal */}
    <dialog id="approve_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-4">Process request</h3>
          <p className="mb-4 text-gray-600">Are you sure you want to process this request to budget management?</p>
            <div className="flex flex-col gap-4">
              <div className="flex justify-end gap-4">
                {!isLoading && 
                  <button className="btn btn-success px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200" onClick={() => handleProcess()}>
                  Yes
                </button>
                }
                
                {isLoading && 
                  <button className="btn btn-success px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200">
                    <span className="loading loading-spinner loading-md"></span>
                </button>
                }
                <button
                  className="btn btn-error px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                  onClick={() => document.getElementById("approve_modal").close()}
                >
                  No
                </button>
              </div>
             </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

{/* Decline Modal */}
    <dialog id="decline_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-4">Decline Budget Request</h3>
          <p className="mb-4 text-gray-600">Are you sure you want to decline this request?</p>
            <div className="flex flex-col gap-4">
              <p className="font-bold">Reason:</p>
                <textarea
                  className="textarea textarea-error border-gray-300 rounded-lg p-3"
                  placeholder="Add a comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required/>
                  {required && <h1 className="text-red-600">Reason is Required</h1>}
                <div className="flex justify-end gap-4">
                  {!isLoading &&  <button className="btn btn-success px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200" onClick={() => handleDecline()}>
                    Yes
                  </button>
                  }
                  {isLoading &&  <button className="btn btn-success px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200" onClick={() => handleDecline()}>
                    <span className="loading loading-spinner loading-md"></span>
                  </button>
                  }
                  <button
                    className="btn btn-error px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                    onClick={() => document.getElementById("decline_modal").close()}
                  >
                    No
                  </button>
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

export default ViewRequestPayable;
