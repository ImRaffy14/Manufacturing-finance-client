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
 const [notifications, setNotifications] = useState({
  hasNotifications: true, 
  createInvoice: 3 // Notif count
});

const [isCollapsed, setIsCollapsed] = useState(false);
const toggleSidebar = () => {
  setIsCollapsed((prev) => !prev);
};

const handleCreateInvoiceClick = () => {
  const hasNotifications = notifications.createInvoice > 0 ? false : notifications.hasNotifications;
  setNotifications((prevState) => ({
    ...prevState,
    createInvoice: 0, // 0 Notif when clicked
    hasNotifications: hasNotifications
  }));
};

  return (
    <div
      className={`flex flex-col overflow-auto bg-white text-black border-r-2 sticky top-0 max-md:hidden transition-all duration-300 ${
        isCollapsed ? "w-20 px-4 py-4" : "w-72 lg:w-80 px-2 py-4"
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
                            <Link to="viewCollection"><li className="flex hover:text-blue-500"><a>● ViewCollection</a></li></Link>
                            <Link to="collectionReports"><li className="hover:text-blue-500"><a>● Collection Reports</a></li></Link>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><BsCash/>Budgeting</summary>
                          <ul>
                            <Link to="createBudget"><li className="hover:text-blue-500"><a>● Create Budget</a></li></Link>
                            <Link to="editBudget"><li className="hover:text-blue-500"><a>● View/Edit Budgets</a></li></Link>
                            <Link to="budgetReports"><li className="hover:text-blue-500"><a>● Budget Reports</a></li></Link>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>

            {/* Accounts Receivable */}
            <ul className="menu rounded-box w-56">
      {isCollapsed && <RiUserReceived2Fill className="w-5 h-5" />}
      {!isCollapsed && (
        <li>
          <details open>
            <summary>
              <RiUserReceived2Fill className="w-5 h-5" />
              Accounts Receivable
               {notifications.hasNotifications && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}
            </summary>
            <ul>
              <li>
                <details open>
                  <summary>
                    <FaFileInvoiceDollar />
                    Invoice Generation
                    {notifications.hasNotifications && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}
                  </summary>
                  <ul>
                    <Link to="createInvoice">
                      <li className="hover:text-blue-500" onClick={handleCreateInvoiceClick}>
                        <a>
                          ● Invoice Request
                          {notifications.createInvoice > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 text-center leading-4 ml-2">{notifications.createInvoice}</span>
                          )}
                        </a>
                      </li>
                    </Link>
                    <Link to="pendingInvoice">
                      <li className="hover:text-blue-500">
                        <a>● View Pending Invoice</a>
                      </li>
                    </Link>
                    <Link to="paidInvoice">
                      <li className="hover:text-blue-500">
                        <a>● Paid/Closed Invoices</a>
                      </li>
                    </Link>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
        </li>
      )}
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
                          <Link to="reviewSupplierInvoice"><li className="hover:text-blue-500"><a>● Review Supplier Invoices</a></li></Link>
                          <Link to="approveRejectInvoice"><li className="hover:text-blue-500"><a>● Approve/Reject Invoices</a></li></Link>
                          <Link to="paymentStatus"><li className="hover:text-blue-500"><a>● Payment Status</a></li></Link>
                          <Link to="supplierPaymentHistory"><li className="hover:text-blue-500"><a>● Supplier Payment History</a></li></Link>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><FaCodePullRequest/>Request of Funds</summary>
                          <ul>
                          <Link to="budgetRequest"><li className="hover:text-blue-500"><a>● Budget Requests</a></li></Link>
                          <Link to="budgetApproval"><li className="hover:text-blue-500"><a>● Budget Approval</a></li></Link>
                          <Link to="pendingApproval"><li className="hover:text-blue-500"><a>● Pending Approvals</a></li></Link>
                          <Link to="approvedBudgets"><li className="hover:text-blue-500"><a>● Approved Budgets</a></li></Link>
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
                          <Link to="auditRecords"><li className="hover:text-blue-500"><a>● Audit Records</a></li></Link>
                          <Link to="reviewPaymentTransactions"><li className="hover:text-blue-500"><a>● Review Payment Transactions</a></li></Link>
                          <Link to="viewAuditHistory"><li className="hover:text-blue-500"><a>● View Audit History</a></li></Link>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><TbReportSearch/>Financial Reporting</summary>
                          <ul>
                          <Link to="financialReports"><li className="hover:text-blue-500"><a>● Financial Reports</a></li></Link>
                          <Link to="transactionRecords"><li className="hover:text-blue-500"><a>● Transaction Records</a></li></Link>
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
                          <Link to="accountCreation"><li className="hover:text-blue-500"><a>● Account Requests</a></li></Link>
                          <Link to="viewAllAccounts"><li className="hover:text-blue-500"><a>● View All Accounts</a></li></Link>
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
