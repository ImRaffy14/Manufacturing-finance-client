import React from 'react'
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';   
import JJM  from '../assets/JJM.jfif'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSocket } from '../context/SocketContext'

function viewBudgetRequest() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [comment, setComment] = useState("")
    const [required, setRequired] = useState(false)
    const location = useLocation(); // Get the location object
    const { rowData } = location.state || {}; // Extract rowData from location.state

    if (!rowData) {
      return <p>No data available.</p>;
    }
    
  return (
    <>
     <div className="breadcrumbs text-xl mt-8">
        <ul>
            <li><a> <Link to="/Dashboard/budgetRequest">Return</Link></a></li>
            <li><a className='text-blue-500 underline'>Documents</a></li>
        </ul>
    </div>
    
    <div className="max-w-screen-2xl mx-auto  mb-10 p-10 bg-white">
        
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Budget Request Preview</h1>

  <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Details for Request ID: {rowData.requestId}</h2>
  
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
      <p className="text-gray-700">₱{rowData.totalRequest}</p>
    </div>

    <div className="flex justify-between">
      <p className="font-medium"><strong>Status:</strong></p>
      <p className="text-blue-700"><strong>{rowData.status}</strong></p>
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
      <span>₱{rowData.totalRequest}</span>
    </div>
  </div>

  <div className="text-right font-bold mt-4">
    <p className="text-xl">TOTAL AMOUNT: ₱{rowData.totalRequest}</p>
  </div>
</div>
<div className="flex items-center justify-center mt-4 gap-10">
<button className="btn btn-lg bg-green-400 hover:bg-green-700" onClick={() => document.getElementById("approve_modal").showModal()}>Approve</button>
<button className="btn btn-lg bg-red-400 hover:bg-red-700" onClick={() => document.getElementById("decline_modal").showModal()}>Decline</button>
</div>
    </div>

    <dialog id="approve_modal" className="modal">
        <div className="modal-box">
        <form className="space-y-4" >
            <div>
            <h3 className="font-bold text-lg text-center">Enter Password to Approve Budget</h3>
              <label className="block text-gray-600 font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
              <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
              >
              Confirm Budget  
              </button>
            </form>
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog> 

    {/* Decline Password */}
    <dialog id="confirm_decline_modal" className="modal">
        <div className="modal-box">
        <form className="space-y-4" >
            <div>
            <h3 className="font-bold text-lg text-center">Enter Password to Decline Budget</h3>
              <label className="block text-gray-600 font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
        required
      ></textarea>
      <div className="flex justify-end gap-4">
        <button className="btn btn-success px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200" 
        onClick={() => document.getElementById("confirm_decline_modal").showModal()}>
          Yes
        </button>
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
    </>
  )
}

export default viewBudgetRequest
