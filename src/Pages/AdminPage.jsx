import React, { useState, useEffect } from 'react';
import Dashboard from '../Components/Dashboard';
import Search from '../Components/Search';
import Sidebar from '../Components/Sidebar';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import PageNotFound from '../Pages/pageNotFound';
import AccountCreation from '../Components/accountCreation';
import ApproveRejectPayables from '../Components/approveRejectPayables';
import AuditRecords from '../Components/auditRecords';
import AuditTrails from '../Components/auditTrails';
import BudgetReports from '../Components/budgetReports';
import BudgetRequest from '../Components/budgetRequest';
import FinancialReports from '../Components/financialReports';
import CreatePurchaseOrder from '../Components/createPurchaseOrder';
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
import { getProfile } from '../authentication/auth';

function AdminPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

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

   

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-infinity loading-lg"></span>
            </div>
        );
    }
    
    

    return (
        <div className="h-screen flex">
            <Sidebar  userData={user} />
            <div className="flex-col w-full overflow-auto bg-gray-200">
                {user && <Search userData={user} />}    
                <Routes>
                    <Route path="overview" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/Dashboard/overview" />} />
                    <Route path="*" element={<PageNotFound />} />

                        {/* CASH COLLECTION */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (
                        <Route path="viewCollection" element={<ViewCollection  userData={user}/>} />
                    )}

                        {/* BUDGET MANAGEMENNT */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="budgetRequest" element={<BudgetRequest userData={user} />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="viewBudgetRequest" element={<ViewBudgetRequest userData={user} />} />
                    )}

                        {/* ACCOUNTS RECEIVABLE */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="createPurchaseOrder" element={<CreatePurchaseOrder userData={user} />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="pendingPurchaseOrder" element={<PendingPurchaseOrder />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="paidOrder" element={<PaidOrder />} />
                    )}
                    
                        {/* ACCCOUNTS PAYABLE */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="approveRejectPayables" element={<ApproveRejectPayables />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' ||  user.role === 'ADMIN') && (
                        <Route path="reviewPayables" element={<ReviewPayables />} />
                    )}

                        {/* GENERAL LEDGER */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="reviewPaymentTransactions" element={<ReviewPaymentTransactions />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="viewAuditHistory" element={<ViewAuditHistory />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="financialReports" element={<FinancialReports userData={user}/>} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' || user.role === 'ADMIN') && (   
                        <Route path="transactionRecords" element={<TransactionRecords />} />
                    )}

                        {/* ACCOUNTS MANAGEMENT */}
                    {(user.role === 'ADMIN' || user.role === 'CHIEF FINANCIAL OFFICER')  && (
                        <Route path="accountCreation" element={<AccountCreation userData={user}/>} />
                    )}
                    {(user.role === 'ADMIN' || user.role === 'CHIEF FINANCIAL OFFICER')  && (
                        <Route path="viewAllAccounts" element={<ViewAllAccounts userData={user}/>} />
                    )}

                        {/* AUDIT TRAILS */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ADMIN') && (      
                        <Route path="auditTrails" element={<AuditTrails />} />
                    )}

                        {/* ANOMALY DETECTION */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ADMIN') && (  
                        <Route path="anomalyDetection" element={<AnomalyDetection />} />
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
    );
}

export default AdminPage;
