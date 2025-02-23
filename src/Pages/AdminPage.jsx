import React, { useState, useEffect } from 'react';
import Dashboard from '../Components/Dashboard';
import Search from '../Components/Search';
import Sidebar from '../Components/Sidebar';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import PageNotFound from '../Pages/pageNotFound';
import AccountCreation from '../Components/accountCreation';
import ActiveStaff from '../Components/activeStaff';
import ApproveRejectPayables from '../Components/approveRejectPayables';
import AuditRecords from '../Components/auditRecords';
import AuditTrails from '../Components/auditTrails';
import BudgetReports from '../Components/budgetReports';
import BudgetRequest from '../Components/budgetRequest';
import BlackListedIP from '../Components/blacklistedIP';
import FinancialReports from '../Components/financialReports';
import CreatePurchaseOrder from '../Components/createPurchaseOrder';
import ChartOfAccounts from '../Components/chartOfAccounts';
import CommandTerminal from '../Components/commandTerminal';
import ManageRolesPermissions from '../Components/manageRolesPermissions';
import PaidOrder from '../Components/paidOrder';
import PendingPurchaseOrder from '../Components/pendingPurchaseOrder';
import ReviewPaymentTransactions from '../Components/reviewPaymentTransactions';
import ReviewPayables from '../Components/reviewPayables';
import TransactionRecords from '../Components/transactionRecords';
import ViewAllAccounts from '../Components/viewAllAccounts';
import ViewAuditHistory from '../Components/viewAuditHistory';
import ViewCollection from '../Components/viewCollection';
import InvoiceDownload from '../Components/invoiceDownload';
import AnomalyDetection from '../Components/anomalyDetection';
import ReviewViewCollection from '../Components/reviewViewCollection';
import ViewRequestPayable from '../Components/viewRequestPayable';
import ViewReviewPaymentTransactions from '../Components/viewReviewPaymentTransactions';
import ViewBudgetRequest from '../Components/viewBudgetRequest';
import ViewFinancialReports from '../Components/viewFinancialReports';
import { MdManageAccounts } from "react-icons/md";
import { AiOutlineClose } from 'react-icons/ai';
import { getProfile } from '../authentication/auth';
import { useSocket } from '../context/SocketContext';
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const activeStaffCount = 5;
    const socket = useSocket()
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_AUTH_URL;

    const activeStaff = [
        { "id": 1, "name": "John Doe", "role": "Finance Manager" },
        { "id": 2, "name": "Jane Smith", "role": "Accountant" }
      ]

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile()
                setUser(data);
            } catch (error) {
                console.error('Error fetching profile', error);
                localStorage.removeItem('token');
                navigate('/', { state: { expired: true } });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);


    useEffect(() => {
        if(!socket) return

        // FORCE DISCONNECT STAFF
        const forceDisconnectStaff = async (response) => {
        socket.disconnect();
        localStorage.removeItem('token')
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        toast.error('You have been disconnected by the Admin/Supervisor.',{
          position: 'top-center'
        })
        setTimeout(() => {
          window.location.href = "/";
        }, 5500)
  
      }
      
      socket.on('force_disconnect', forceDisconnectStaff)

      return () => {
        socket.off('force_disconnect')
      }

    }, [socket])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-infinity loading-lg"></span>
            </div>
        );
    }
    return (
        <>
        <div className="h-screen flex">
            <Sidebar  userData={user} />
            <div className="flex-col w-full overflow-auto bg-gray-200">
            {(user.role === 'SUPER ADMIN') && (
            <div className="fixed bottom-3 right-20 z-[9999] pointer-events-auto">
          {/* Floating Chat Button */}
          {!isOpen && (
            <button
              className="relative bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
              onClick={() => setIsOpen(true)}
            >
              <MdManageAccounts size={30} />
              {/* Notification Badge */}
              {activeStaffCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeStaffCount}
                </span>
              )}
            </button>
          )}

          {/* Popup Window */}
          {isOpen && (
            <div className="bg-white w-1/2 h-96 rounded-xl shadow-2xl fixed bottom-16 right-20 border border-gray-300 flex flex-col z-[9999]">
              {/* Header */}
              <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
                <span className="font-semibold">Active Staff</span>
                <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 transition">
                  <AiOutlineClose size={22} />
                </button>
              </div>

              {/* Active Staff Component */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <ActiveStaff userData={user} />
              </div>
            </div>
          )}
        </div>
        )}
                {user && <Search userData={user} />}    
                <Routes>
                    <Route path="overview" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/Dashboard/overview" />} />
                    <Route path="*" element={<PageNotFound />} />

                        {/* CASH COLLECTION */}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (
                        <Route path="viewCollection" element={<ViewCollection  userData={user}/>} />
                    )}

                        {/* BUDGET MANAGEMENNT */}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="budgetRequest" element={<BudgetRequest userData={user} />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="viewBudgetRequest" element={<ViewBudgetRequest userData={user} />} />
                    )}

                        {/* ACCOUNTS RECEIVABLE */}
                    {(user.role === 'SUPER ADMIN' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="createPurchaseOrder" element={<CreatePurchaseOrder userData={user} />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="pendingPurchaseOrder" element={<PendingPurchaseOrder />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="paidOrder" element={<PaidOrder />} />
                    )}
                    
                        {/* ACCCOUNTS PAYABLE */}
                    {(user.role === 'SUPER ADMIN' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="approveRejectPayables" element={<ApproveRejectPayables />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="reviewPayables" element={<ReviewPayables />} />
                    )}

                        {/* GENERAL LEDGER */}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="reviewPaymentTransactions" element={<ReviewPaymentTransactions />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="viewAuditHistory" element={<ViewAuditHistory />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="financialReports" element={<FinancialReports userData={user}/>} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="transactionRecords" element={<TransactionRecords />} />
                    )}
                    {(user.role === 'SUPER ADMIN' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                     <Route path="chartOfAccounts" element={<ChartOfAccounts userData={user}/>}/>
                    )}
                        {/* ACCOUNTS MANAGEMENT */}
                    {(user.role === 'ADMIN' || user.role === 'SUPER ADMIN')  && (
                        <Route path="accountCreation" element={<AccountCreation userData={user}/>} />
                    )}
                    {(user.role === 'ADMIN' || user.role === 'SUPER ADMIN')  && (
                        <Route path="viewAllAccounts" element={<ViewAllAccounts userData={user}/>} />
                    )}

                    {/*SYSTEM CONFIG */}

                        {/* AUDIT TRAILS */}
                    {(user.role === 'SUPER ADMIN') && (      
                        <Route path="auditTrails" element={<AuditTrails />} />
                    )}

                        {/* ANOMALY DETECTION */}
                    {(user.role === 'SUPER ADMIN') && (  
                        <Route path="anomalyDetection" element={<AnomalyDetection userData={user} />} />
                    )}

                    {/* BLACKLISTED IP */}
                    {(user.role === 'SUPER ADMIN') && (  
                        <Route path="blacklistedIP" element={<BlackListedIP  userData={user} />} />
                    )}

                    {/* ACTIVE STAFF */}
                    {(user.role === 'SUPER ADMIN') && (  
                        <Route path="activeStaff" element={<ActiveStaff  userData={user} />} />
                    )}

                    {(user.role === 'SUPER ADMIN') && (  
                        <Route path="commandTerminal" element={<CommandTerminal  userData={user} />} />
                    )}

                    <Route path="viewFinancialReports" element={<ViewFinancialReports userData={user}/>}/>
                    <Route path="auditRecords" element={<AuditRecords />} />    
                    <Route path="budgetReports" element={<BudgetReports />} />
                    <Route path="manageRolesPermissions" element={<ManageRolesPermissions />} />
                    <Route path="invoiceDownload" element={<InvoiceDownload />} />
                    <Route path="viewReviewPaymentTransactions" element={<ViewReviewPaymentTransactions userData={user}/>} />
                    <Route path="viewRequestPayable" element={<ViewRequestPayable  userData={user}/>} />
                    <Route path="reviewViewCollection" element={<ReviewViewCollection/>}/>

                </Routes>
            </div>
        </div>
        </>
    );
}

export default AdminPage;
