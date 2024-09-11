import Dashboard from '../Components/Dashboard';
import Search from '../Components/Search';
import Sidebar from '../Components/Sidebar';
import { Routes, Route } from 'react-router-dom'
import Page1 from '../Pages/page1'
import Budgeting from '../Components/Budgeting';
import CashCollection from '../Components/cashCollection';
import Accounts from '../Components/Accounts';
import AuditControl from '../Components/auditControl';
import InvoiceGeneration from '../Components/invoiceGeneration';
import ReportingCompliance from '../Components/reportingCompliance';
import VendorInvoice from '../Components/vendorInvoice';


function AdminPage () {
    return(
        <>
            <div className="flex">
                <Sidebar />
                <div className="flex-col w-full">
                    <Search />
                    <Routes>
                        <Route path="/" element={ <Dashboard/> } />
                        <Route path="page1" element={ <Page1/> } />
                        <Route path="Budgeting" element={ <Budgeting/> } />
                        <Route path="CashCollection" element={ <CashCollection/> } />
                        <Route path="Accounts" element={ <Accounts/> } />
                        <Route path="AuditControl" element={ <AuditControl/> } />
                        <Route path="InvoiceGeneration" element={ <InvoiceGeneration/> } />
                        <Route path="ReportingCompliance" element={ <ReportingCompliance/> } />
                        <Route path="VendorInvoice" element={ <VendorInvoice/> } />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default AdminPage