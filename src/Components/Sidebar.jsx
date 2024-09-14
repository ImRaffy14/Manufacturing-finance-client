import { useState } from "react";
import layout from '../assets/layout.png';
import { MdOutlineScreenshotMonitor } from "react-icons/md";
import { RiUserReceived2Fill } from "react-icons/ri";
import { TbBrandCashapp } from "react-icons/tb";
import { MdAccountCircle } from "react-icons/md";
import { SiAmazonpay } from "react-icons/si";
import { FaList } from "react-icons/fa";

import { MdOutlineCallReceived } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaCodePullRequest } from "react-icons/fa6";
import { AiOutlineAudit } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { MdManageAccounts } from "react-icons/md";
import { MdSpatialTracking } from "react-icons/md";

import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom"


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);


  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  


  return (
    <div
      className={`flex flex-col overflow-auto bg-white text-black px-4 py-4 border-r-2 sticky top-0 max-md:hidden transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72 lg:w-80"
      }`}
      aria-label="Sidebar"
    >
      {/* Toggle Button */}
      <div className="flex justify-e">
      <button
        onClick={toggleSidebar}
        className={`mb-4 p-1 text-black border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200  ${
          isCollapsed ? "w-11" : "w-11 "
        }`}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? "▶" : "◀"}
      </button>
      </div>
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-8 justify-center"
        aria-label="Dashboard Logo"
      >
        <img src={layout} alt="Dashboard logo" className="w-10 h-10" />
        {!isCollapsed && <Link to="" ><p className="text-xl font-bold">Dashboard</p></Link>}
      </div>

      {/* Dashboard */}
      <Link to=""><div
        className="flex items-center gap-2 hover:bg-gray-300 transition-all duration-300 p-2 rounded-md mb-4 cursor-pointer"
        aria-label="Dashboard"
      >
        <MdOutlineScreenshotMonitor className="w-5 h-5" />
        {!isCollapsed && <p className="text-sm font-semibold">Dashboard</p>}
      </div></Link>

      {/* Apps */}
      <div className="mb-2">
        <p
          className={`text-gray-500 mb-2 font-semibold text-sm ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          Modules
        </p>
        
        
        {/* Cash management */}
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <TbBrandCashapp className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><TbBrandCashapp className="w-5 h-5" /> Cash Management</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><MdOutlineCallReceived/>Cash Collection</summary>
                          <ul>
                            <Link to="viewCollection"><li className="flex hover:text-blue-500">● ViewCollection</li></Link>
                            <Link to="collectionReports"><li className="hover:text-blue-500">● Collection Reports</li></Link>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><BsCash/>Budgeting</summary>
                          <ul>
                            <Link to="createBudget"><li className="hover:text-blue-500">● Create Budget</li></Link>
                            <Link to="editBudget"><li className="hover:text-blue-500">● View/Edit Budgets</li></Link>
                            <Link to="budgetReports"><li className="hover:text-blue-500">● Budget Reports</li></Link>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>

            {/* Accounts Receivable */}
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <RiUserReceived2Fill className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><RiUserReceived2Fill className="w-5 h-5" /> Accounts Receivable</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><FaFileInvoiceDollar/>Invoice Generation</summary>
                          <ul>
                            <Link to="createInvoice"><li className="hover:text-blue-500">● Create Invoice</li></Link>
                            <Link to="pendingInvoice"><li className="hover:text-blue-500">● View Pending Invoice</li></Link>
                            <Link to="paidInvoice"><li className="hover:text-blue-500">● Paid/Closed Invoices</li></Link>
                            <Link to="customerPaymentStatus"><li className="hover:text-blue-500">● Customer Payment Status</li></Link>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>

        {/* Accounts Payable */}
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <SiAmazonpay className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><SiAmazonpay className="w-5 h-5" /> Accounts Payable</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><LiaFileInvoiceDollarSolid/>Manage Invoices</summary>
                          <ul>
                          <Link to="reviewSupplierInvoice"><li className="hover:text-blue-500">● Review Supplier Invoices</li></Link>
                          <Link to="approveRejectInvoice"><li className="hover:text-blue-500">● Approve/Reject Invoices</li></Link>
                          <Link to="paymentStatus"><li className="hover:text-blue-500">● Payment Status</li></Link>
                          <Link to="supplierPaymentHistory"><li className="hover:text-blue-500">● Supplier Payment History</li></Link>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><FaCodePullRequest/>Request of Funds</summary>
                          <ul>
                          <Link to="budgetRequest"><li className="hover:text-blue-500">● Budget Requests</li></Link>
                          <Link to="budgetApproval"><li className="hover:text-blue-500">● Budget Approval</li></Link>
                          <Link to="pendingApproval"><li className="hover:text-blue-500">● Pending Approvals</li></Link>
                          <Link to="approvedBudgets"><li className="hover:text-blue-500">● Approved Budgets</li></Link>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>

        {/* General Ledger */}
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <FaList className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><FaList className="w-5 h-5" />General Ledger</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><AiOutlineAudit/>Internal Audit and Controls</summary>
                          <ul>
                          <Link to="auditRecords"><li className="hover:text-blue-500">● Audit Records</li></Link>
                          <Link to="reviewPaymentTransactions"><li className="hover:text-blue-500">● Review Payment Transactions</li></Link>
                          <Link to="viewAuditHistory"><li className="hover:text-blue-500">● View Audit History</li></Link>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><TbReportSearch/>Financial Reporting</summary>
                          <ul>
                          <Link to="financialReports"><li className="hover:text-blue-500">● Financial Reports</li></Link>
                          <Link to="transactionRecords"><li className="hover:text-blue-500">● Transaction Records</li></Link>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>

        {/* Accounts Management */}
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <MdAccountCircle className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><MdAccountCircle className="w-5 h-5" />Accounts Management</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><MdManageAccounts/>Manage Accounts</summary>
                          <ul>
                          <Link to="accountCreation"><li className="hover:text-blue-500">● Account Requests</li></Link>
                          <Link to=""><li className="hover:text-blue-500">● View All Accounts</li></Link>
                          <Link to=""><li className="hover:text-blue-500">● Manage Roles & Permissions</li></Link>
                          </ul>
                    </details>
                </li>
                
                <Link to="auditTrails">
                  <li>
                    <summary><MdSpatialTracking/>Audit Trails</summary>
                  </li>
                </Link>  
              </ul>
          </details>
          </li>
          }
        </ul>

        
      </div>

      
    </div>
  );
};

export default Sidebar;
