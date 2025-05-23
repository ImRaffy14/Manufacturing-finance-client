import React from 'react';
import { useLocation, Link, } from 'react-router-dom';   
import { useState, useEffect } from 'react';
import JJM from '../assets/JJM.jfif';
import { useSocket } from '../context/SocketContext'
import { toast } from 'react-toastify'

function viewReviewPaymentTransactions({ userData }) {
  const location = useLocation();
  const { rowData } = location.state || {};
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [invalid, setInvalid] = useState("")

  const socket = useSocket()

  //HANDLES LISTENING AN EVENT FROM SOCKET
  useEffect(() => {

    const handleAuditAuthUser = (response) => {
      toast.success(response.msg , {
        position: 'top-right'
      })
  
      setIsLoading(false)
      setIsSubmitted(true)
      setPassword('')
      document.getElementById('audit_modal').close()

      const invoiceTrails = {
        userId: userData._id,
        userName: userData.userName,
        role: userData.role,
        action: "AUDITS SALES RECORD",
        description: `${userData.userName} audits sales records for ${rowData.customerName} P.Order ID: ${rowData._id}`,
      };
  
      socket.emit("addAuditTrails", invoiceTrails);
    }
  
    const handleAuditAuthUserInvalid = (response) => {
      setInvalid(response.msg)
      setIsLoading(false)
      setPassword('')
    }

    const handlesAuditMatched = (response) => {
      toast.error(response.msg , {
        position: 'top-right'
      })
  
      setIsLoading(false)
      setPassword('')
      document.getElementById('audit_modal').close()
    }
  
    socket.on('receive_audit_authUser', handleAuditAuthUser)
    socket.on('receive_audit_authUser_invalid', handleAuditAuthUserInvalid)
    socket.on('receive_audit_matched', handlesAuditMatched)

    return () => {
      socket.off('receive_audit_authUser', handleAuditAuthUser)
      socket.off('receive_audit_authUser_invalid', handleAuditAuthUserInvalid)
      socket.off('receive_audit_matched', handlesAuditMatched)
    }

  }, [socket])
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true)

    const data = {
        userName : userData.userName,
        userId: userData._id,
        password : password,
        invoiceId: rowData._id,
        customerName: rowData.customerName,
        totalAmount: rowData.totalAmount
    }

    socket.emit('auth_user', data)
  }

  if (!rowData) {
    return <p>No data available.</p>;
  }

  const calculateTotalAmount = (price, quantity) => {
    return price * quantity;
  };

  return (
    <>
    <div className="max-w-screen-2xl mx-auto mt-8 mb-10">
      <div className="breadcrumbs text-xl mt-4">
        <ul>
          <li>
            <Link to="/Dashboard/reviewPaymentTransactions">Return</Link>
          </li>
          <li>
            <a className="text-blue-500 underline">Documents</a>
          </li>
        </ul>
      </div>
  
      <div className="rounded-xl shadow-2xl bg-white p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Payment Review</h1>
        {/* DETAILS */}
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">
          Details for P.Order ID: {rowData._id}
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="font-medium"><strong>Customer ID:</strong></p>
            <p className="text-gray-700">{rowData.customerId}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium"><strong>Customer Name:</strong></p>
            <p className="text-gray-700">{rowData.customerName}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium"><strong>Contact Details:</strong></p>
            <p className="text-gray-700">{rowData.customerContact}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium"><strong>P.Order Date:</strong></p>
            <p className="text-gray-700">{rowData.invoiceDate}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium"><strong>Due Date:</strong></p>
            <p className="text-gray-700">{rowData.dueDate}</p>
          </div>
        </div>
  
        {/* PURCHASE ORDER PREVIEW */}
        <div className="w-full mx-auto mt-8 bg-white p-6 border shadow-md rounded-xl" id="payable-preview">
          <div className="flex justify-between items-center mb-4">
            <div>
              <img src={JJM} className="h-20 w-20" alt="Logo" />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold">Purchase Order</h3>
              <p><strong>P.Order ID:</strong> {rowData._id}</p>
            </div>
          </div>
          <div className="mb-4">
            <p><strong>Customer ID:</strong> {rowData._id}</p>
            <p><strong>Customer Name:</strong> {rowData.customerName}</p>
            <p><strong>P.Order Date:</strong> {rowData.invoiceDate}</p>
            <p><strong>Due Date:</strong> {rowData.dueDate}</p>
          </div>
  
          {/* ITEMS TABLE */}
          <h3 className="text-xl font-bold mt-6 mb-4">Items</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Item Price (₱)</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total Amount (₱)</th>
              </tr>
            </thead>
            <tbody>
              {rowData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₱{item.price}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ₱{calculateTotalAmount(item.price, item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* TOTAL AMOUNT */}
          <div className="text-right font-bold mt-4">
            <p className="text-xl">TOTAL AMOUNT: ₱{rowData.totalAmount}</p>
          </div>
        </div>
  
        {/* AUDIT BUTTON */}
        <div className="flex items-center justify-center mt-4 gap-10">
          {!isSubmitted && (
            <button
              className="btn btn-lg bg-green-400 hover:bg-green-700 w-[150px]"
              onClick={() => document.getElementById('audit_modal').showModal()}
            >
              Audit
            </button>
          )}
        </div>
      </div>
    </div>
  
    {/* AUDIT MODAL */}
    <dialog id="audit_modal" className="modal">
      <div className="modal-box">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h3 className="font-bold text-lg text-center">Enter Password to Audit Payment</h3>
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
  
          {invalid && <h1 className="text-red-500">{invalid}</h1>}
  
          {!isLoading && (
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800">
              Confirm Audit
            </button>
          )}
        </form>
  
        {isLoading && (
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 mt-4 w-[140px]">
            <span className="loading loading-spinner loading-sm"></span>
          </button>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </>    
  );
}

export default viewReviewPaymentTransactions;
