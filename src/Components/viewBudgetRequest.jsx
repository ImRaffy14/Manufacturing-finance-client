import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';   
import JJM  from '../assets/JJM.jfif'
import { toast } from 'react-toastify'
import { useSocket } from '../context/SocketContext'

function viewBudgetRequest({userData}) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [authFailed, setAuthFailed] = useState("")
    const [password, setPassword] = useState("")
    const [comment, setComment] = useState("")
    const location = useLocation(); // Get the location object
    const { rowData } = location.state || {}; // Extract rowData from location.state
          if (!rowData) {
            return <p>No data available.</p>;
          }
    const socket = useSocket()
    const formatCurrency = (value) => {
      return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    //HANDLES DATA PROCCESS / DATA EMIT
    useEffect(() => {   
      
      if(!socket) return;

      const handlesResponse = (response) => {
        toast.success(response.msg, {
          position: "top-right"
        })

        const accountCreationTrails = {
          userId: userData._id,
          userName: userData.userName,
          role: userData.role,
          action: response.status === "Approved" ? "APPROVED BUDGET REQUEST" : "DECLINED BUDGET REQUEST",
          description: response.status === "Approved" ? `${userData.userName} approved the budget request for ${rowData.department} with a total budget of ${rowData.totalRequest}`
          : `${userData.userName} declined the budget request for ${rowData.department}. Reason: ${response.comment}`,
    
        };
        
        
        socket.emit("addAuditTrails", accountCreationTrails);

        setPassword("")
        setComment("")
        setIsSubmitted(true)
        setIsLoading(false)

        document.getElementById("approve_modal").close()
        document.getElementById("decline_modal").close()
        document.getElementById("confirm_decline_modal").close()
      }

      const handleAuthFailed = (response) => {
        setAuthFailed(response.msg)
        setIsLoading(false)
        setPassword("")
      }

      const handleError = (response) => {
        toast.error(response.msg, {
          position: "top-right"
        })
        
        setPassword("")
        setComment("")
        setIsLoading(false)
        document.getElementById("approve_modal").close()
        document.getElementById("decline_modal").close()
        document.getElementById("confirm_decline_modal").close()
      }

      socket.on("receive_budget_request", handlesResponse)
      socket.on("receive_budget_authUser_invalid", handleAuthFailed)
      socket.on("budget_notfound", handleError)

      return () => {
        socket.off("receive_budget_request")
        socket.off("receive_budget_authUser_invalid")
        socket.off("budget_notfound")
      } 
    }, [socket])

    //HANDLES APPROVED
    const handleSubmit = (e) =>{
      e.preventDefault()

      const approvedBudgetData = {
        _id: rowData._id,
        requestId: rowData.requestId,
        department: rowData.department,
        typeOfRequest: rowData.typeOfRequest, 
        category: rowData.category,
        reason: rowData.reason,
        totalRequest: rowData.totalRequest,
        documents: rowData.documents,
        status: "Approved",
        comment: "Finance manager approves the budget request."
    }

      setIsLoading(true)
      socket.emit("budget_request_data", { rowData: approvedBudgetData, authenticate: {userId: userData._id, userName: userData.userName, password}})
    }

    //HANDLES DECLINED
    const handlesDecline = (e) => {
      e.preventDefault()

      const declinedBudgetData = {
        _id: rowData._id,
        requestId: rowData.requestId,
        department: rowData.department,
        typeOfRequest: rowData.typeOfRequest, 
        category: rowData.category,
        reason: rowData.reason,
        totalRequest: rowData.totalRequest,
        documents: rowData.documents,
        status: "Declined",
        comment: comment
    }

    setIsLoading(true)
    socket.emit("budget_request_data", { rowData: declinedBudgetData, authenticate: {userId: userData._id, userName: userData.userName, password}})

    }
    
  return (
    <>
    <div className="max-w-screen-2xl mx-auto">
      <div className="breadcrumbs text-xl mt-8">
        <ul>
          <li><a> <Link to="/Dashboard/budgetRequest">Return</Link></a></li>
          <li><a className='text-blue-500 underline'>Documents</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-screen-2xl mx-auto mb-10 p-10 bg-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Budget Request Preview</h1>
      <h2 className="text-2xl font-semibold mb-4 mt-10 border-b pb-2 border-gray-300">Details for Request ID : <strong>{rowData.requestId}</strong></h2>
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
            <p className="text-gray-700">{rowData.reason || 'KUMAIN NG PUDAY'}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium"><strong>Total Amount:</strong></p>
            <p className="text-gray-700">{formatCurrency(rowData.totalRequest)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium"><strong>Status:</strong></p>
            <p className="text-blue-700"><strong>{rowData.status}</strong></p>
          </div>
        </div>

      {/* Invoice-style Preview below */}
      <div className="w-full mx-auto mt-8 bg-white p-6 border shadow-md" id="payable-preview">
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
        {!isSubmitted && 
          <>
            <button className="btn btn-lg bg-green-400 hover:bg-green-700" onClick={() => document.getElementById("approve_modal").showModal()}>Approve</button>
            <button className="btn btn-lg bg-red-400 hover:bg-red-700" onClick={() => document.getElementById("decline_modal").showModal()}>Decline</button>
          </>
        }
      </div>
    </div>

    <dialog id="approve_modal" className="modal">
        <div className="modal-box">
          <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <h3 className="font-bold text-lg text-center">Enter Password to Approve Budget</h3>
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
              {authFailed &&
              <h1 className="text-red-500">{authFailed}</h1> 
              }
              {!isLoading && 
                <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                >
                Confirm Budget  
                </button>
              }
          </form>
            {isLoading && 
              <button
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-800 mt-4 w-[145px]"
              >
              <span className="loading loading-spinner loading-md"></span> 
              </button>
            }
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog> 

    {/* Decline Password */}
    <dialog id="confirm_decline_modal" className="modal">
        <div className="modal-box">
        <form className="space-y-4" onSubmit={handlesDecline}>
            <div>
            <h3 className="font-bold text-lg text-center">Enter Password to Decline Budget</h3>
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
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
              >
              Decline Budget  
              </button>
            </form>
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog> 

    {/* Decline Modal */}
    <dialog id="decline_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-4">Decline Budget</h3>
          <p className="mb-4 text-gray-600">Are you sure you want to decline this budget?</p>
            <div className="flex flex-col gap-4">
              <p className="font-bold">Reason:</p>
                <textarea
                  className="textarea textarea-error border-gray-300 rounded-lg p-3"
                  placeholder="Add a comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required />
              <div className="flex justify-end gap-4">
                <button className="btn btn-success px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200" 
                onClick={() => document.getElementById("confirm_decline_modal").showModal()}>
                  Yes
                </button>
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
  )
}

export default viewBudgetRequest
