import React, { useState, useEffect } from 'react';
import Dashboard from '../Components/Dashboard';
import Search from '../Components/Search';
import Sidebar from '../Components/Sidebar';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import PageNotFound from '../Pages/pageNotFound';
import AccountCreation from '../Components/accountCreation';
import ApprovedBudgets from '../Components/approvedBudgets';
import ApproveRejectPayables from '../Components/approveRejectPayables';
import AuditRecords from '../Components/auditRecords';
import AuditTrails from '../Components/auditTrails';
import BudgetApproval from '../Components/budgetApproval';
import BudgetReports from '../Components/budgetReports';
import BudgetRequest from '../Components/budgetRequest';
import CollectionReports from '../Components/collectionReports';
import FinancialReports from '../Components/financialReports';
import CreateBudget from '../Components/createBudget';
import CreateFinancialReport from '../Components/createFinancialReport';
import CreateInvoice from '../Components/createInvoice';
import CustomerPaymentStatus from '../Components/customerPaymentStatus';
import EditAccounts from '../Components/editAccounts';
import EditBudget from '../Components/editBudget';
import GenerateReports from '../Components/generateReports';
import ManageAuditors from '../Components/manageAuditors';
import ManageRolesPermissions from '../Components/manageRolesPermissions';
import PaidInvoice from '../Components/paidInvoice';
import PaymentStatus from '../Components/paymentStatus';
import PendingApproval from '../Components/pendingApproval';
import PendingInvoice from '../Components/pendingInvoice';
import ReviewPaymentTransactions from '../Components/reviewPaymentTransactions';
import ReviewPayables from '../Components/reviewPayables';
import RupplierPaymentHistory from '../Components/supplierPaymentHistory';
import TransactionRecords from '../Components/transactionRecords';
import ViewAllAccounts from '../Components/viewAllAccounts';
import ViewAuditHistory from '../Components/viewAuditHistory';
import ViewCollection from '../Components/viewCollection';
import InvoiceDownload from '../Components/invoiceDownload';
import AnomalyDetection from '../Components/anomalyDetection';
import ViewRequestPayable from '../Components/viewRequestPayable';
import ViewReviewPaymentTransactions from '../Components/viewReviewPaymentTransactions';
import ViewBudgetRequest from '../Components/viewBudgetRequest';
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

                        {/* Cash Collection */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' || user.role === 'ADMIN') && (
                        <Route path="collectionReports" element={<CollectionReports />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ACCOUNTANT' || user.role === 'ADMIN') && (
                        <Route path="viewCollection" element={<ViewCollection />} />
                    )}

                        {/* Budget Management */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="approvedBudgets" element={<ApprovedBudgets />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="budgetRequest" element={<BudgetRequest />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="budgetApproval" element={<BudgetApproval />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="pendingApproval" element={<PendingApproval />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCE MANAGER' ||  user.role === 'ADMIN') && (
                        <Route path="viewBudgetRequest" element={<ViewBudgetRequest />} />
                    )}

                        {/* Accounts Receivable */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'TREASURER' || user.role === 'TREASURER' ||  user.role === 'ADMIN') && (
                        <Route path="createInvoice" element={<CreateInvoice userData={user} />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'TREASURER' || user.role === 'TREASURER' ||  user.role === 'ADMIN') && (
                        <Route path="pendingInvoice" element={<PendingInvoice />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'TREASURER' || user.role === 'TREASURER' ||  user.role === 'ADMIN') && (
                        <Route path="paidInvoice" element={<PaidInvoice />} />
                    )}
                    
                        {/* Accounts Payable */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'TREASURER' || user.role === 'TREASURER' ||  user.role === 'ADMIN') && (
                        <Route path="approveRejectPayables" element={<ApproveRejectPayables />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'TREASURER' || user.role === 'TREASURER' ||  user.role === 'ADMIN') && (
                        <Route path="reviewPayables" element={<ReviewPayables />} />
                    )}

                        {/* General Ledger */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCIAL ANALYST' ||  user.role === 'FINANCE MANAGER' || user.role ==='ACCOUNTANT' || user.role === 'ADMIN') && (   
                        <Route path="reviewPaymentTransactions" element={<ReviewPaymentTransactions />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCIAL ANALYST' ||  user.role === 'FINANCE MANAGER' || user.role ==='ACCOUNTANT' || user.role === 'ADMIN') && (   
                        <Route path="viewAuditHistory" element={<ViewAuditHistory />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCIAL ANALYST' ||  user.role === 'FINANCE MANAGER' || user.role ==='ACCOUNTANT' || user.role === 'ADMIN') && (   
                        <Route path="financialReports" element={<FinancialReports />} />
                    )}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'FINANCIAL ANALYST' ||  user.role === 'FINANCE MANAGER' || user.role ==='ACCOUNTANT' || user.role === 'ADMIN') && (   
                        <Route path="transactionRecords" element={<TransactionRecords />} />
                    )}

                        {/* Account's Management */}
                    {(user.role === 'ADMIN' || user.role === 'FINANCE MANAGER')  && (
                        <Route path="accountCreation" element={<AccountCreation userData={user}/>} />
                    )}
                    {(user.role === 'ADMIN' || user.role === 'FINANCE MANAGER')  && (
                        <Route path="viewAllAccounts" element={<ViewAllAccounts userData={user}/>} />
                    )}

                        {/* Audit Trails */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ADMIN') && (      
                        <Route path="auditTrails" element={<AuditTrails />} />
                    )}

                        {/* Anomaly Detection */}
                    {(user.role === 'CHIEF FINANCIAL OFFICER' || user.role === 'ADMIN') && (  
                        <Route path="anomalyDetection" element={<AnomalyDetection />} />
                    )}

                    <Route path="auditRecords" element={<AuditRecords />} />    
                    <Route path="budgetReports" element={<BudgetReports />} />
                    <Route path="createBudget" element={<CreateBudget />} />
                    <Route path="createFinancialReport" element={<CreateFinancialReport />} />
                    <Route path="customerPaymentStatus" element={<CustomerPaymentStatus />} />
                    <Route path="editAccounts" element={<EditAccounts />} />
                    <Route path="editBudget" element={<EditBudget />} />
                    <Route path="generateReports" element={<GenerateReports />} />
                    <Route path="manageAuditors" element={<ManageAuditors />} />
                    <Route path="manageRolesPermissions" element={<ManageRolesPermissions />} />
                    <Route path="paymentStatus" element={<PaymentStatus />} />
                    <Route path="supplierPaymentHistory" element={<RupplierPaymentHistory />} />
                    <Route path="invoiceDownload" element={<InvoiceDownload />} />
                    <Route path="viewReviewPaymentTransactions" element={<ViewReviewPaymentTransactions userData={user}/>} />
                    <Route path="viewRequestPayable" element={<ViewRequestPayable  userData={user}/>} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminPage;
