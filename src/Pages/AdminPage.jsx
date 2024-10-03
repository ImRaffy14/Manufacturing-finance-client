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
            <Sidebar />
            <div className="flex-col w-full overflow-auto bg-gray-200">
                {user && <Search userData={user} />}    
                <Routes>
                    <Route path="overview" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/Dashboard/overview" />} />
                    <Route path="*" element={<PageNotFound />} />
                    <Route path="accountCreation" element={<AccountCreation userData={user}/>} />
                    <Route path="approvedBudgets" element={<ApprovedBudgets />} />
                    <Route path="approveRejectPayables" element={<ApproveRejectPayables />} />
                    <Route path="auditRecords" element={<AuditRecords />} />
                    <Route path="auditTrails" element={<AuditTrails />} />
                    <Route path="budgetApproval" element={<BudgetApproval />} />
                    <Route path="budgetReports" element={<BudgetReports />} />
                    <Route path="budgetRequest" element={<BudgetRequest />} />
                    <Route path="collectionReports" element={<CollectionReports />} />
                    <Route path="financialReports" element={<FinancialReports />} />
                    <Route path="createBudget" element={<CreateBudget />} />
                    <Route path="createFinancialReport" element={<CreateFinancialReport />} />
                    <Route path="createInvoice" element={<CreateInvoice userData={user} />} />
                    <Route path="customerPaymentStatus" element={<CustomerPaymentStatus />} />
                    <Route path="editAccounts" element={<EditAccounts />} />
                    <Route path="editBudget" element={<EditBudget />} />
                    <Route path="generateReports" element={<GenerateReports />} />
                    <Route path="manageAuditors" element={<ManageAuditors />} />
                    <Route path="manageRolesPermissions" element={<ManageRolesPermissions />} />
                    <Route path="paidInvoice" element={<PaidInvoice />} />
                    <Route path="paymentStatus" element={<PaymentStatus />} />
                    <Route path="pendingApproval" element={<PendingApproval />} />
                    <Route path="pendingInvoice" element={<PendingInvoice />} />
                    <Route path="reviewPaymentTransactions" element={<ReviewPaymentTransactions />} />
                    <Route path="reviewPayables" element={<ReviewPayables />} />
                    <Route path="supplierPaymentHistory" element={<RupplierPaymentHistory />} />
                    <Route path="transactionRecords" element={<TransactionRecords />} />
                    <Route path="viewAllAccounts" element={<ViewAllAccounts userData={user}/>} />
                    <Route path="viewAuditHistory" element={<ViewAuditHistory />} />
                    <Route path="viewCollection" element={<ViewCollection />} />
                    <Route path="invoiceDownload" element={<InvoiceDownload />} />
                    <Route path="anomalyDetection" element={<AnomalyDetection />} />
                    <Route path="viewRequestPayable" element={<ViewRequestPayable />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminPage;
