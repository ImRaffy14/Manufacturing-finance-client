import React, { useState, useEffect } from 'react';
import layout from '../assets/layout.png';
import JJM from '../assets/JJM.jfif';
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
import { Link, NavLink } from "react-router-dom"
import { VscBracketError } from "react-icons/vsc";
import { SiAdobeaudition } from "react-icons/si";
import { TbCreditCardPay } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
import { TbZoomMoney } from "react-icons/tb";
import { useSocket } from '../context/SocketContext';


const Sidebar = ({ userData }) => {

  const [ payableLength, setPayableLength ] = useState(0)
  const [ paidLength, setPaidLength] = useState(0)
  const [ budgetLength, setBudgetLength] = useState(0)

  const socket = useSocket()

  const [notifications, setNotifications] = useState({
    hasNotifications: true, 
    createInvoice: 0,
    accountRequest: 0, 
    reviewPayable: 0,
    reviewPaymentHistory: 0,
    budgetRequest: 0,
  });

const initialData = [
  { orderNumber: 1, customerId: 1, customerName: 'Burarrat', customerAddress: 'Edinburgh', orderItem: 'Suka, tubig, patis', contactInformation: '0909090909', createInvoice: '' },
  { orderNumber: 2, customerId: 2, customerName: 'Burarrat', customerAddress: 'Edinburgh', orderItem: 'Suka, tubig, patis', contactInformation: '0909090909', createInvoice: '' },
  { orderNumber: 3, customerId: 3, customerName: 'Burarrat', customerAddress: 'Edinburgh', orderItem  : 'Suka, tubig, patis', contactInformation: '0909090909', createInvoice: '' },
  // Add more data as needed
];

const initialAccountRequestData = [
  { requestId: 1, accountName: 'John Doe', requestType: 'Account Creation' },
  { requestId: 2, accountName: 'Jane Smith', requestType: 'Password Reset' },
  // Add more data as needed
];



const fetchNotificationData = () => {
  const createInvoiceCount = initialData.length; //DATA LENGTH
  const accountRequestCount = initialAccountRequestData.length; // ACCOUNT REQ DATA LENGTH

  // UPDATE
  setNotifications((prevState) => ({
    ...prevState,
    createInvoice: createInvoiceCount,
    accountRequest: accountRequestCount,
    hasNotifications: createInvoiceCount > 0 || accountRequestCount > 0 || reviewPayableCount > 0 || reviewPaymentTransactionsCount > 0 || budgetRequestCount > 0,
  }));
};

useEffect(() => {
  // Fetch notification data and emit socket events
  fetchNotificationData();

  socket.emit('get_payable_length', { msg: "get payable length" });
  socket.emit('get_paid_records', { msg: "get paid records length" });
  socket.emit('get_budget_request_length', { msg: "get budget request records length" });

}, [socket]);  // Ensure socket is in the dependency array to prevent potential issues if socket changes

useEffect(() => {
  if (!socket) return;

  // Define event handlers
  const handlePayableLength = (response) => {
    setPayableLength(response);
  };

  const handlePaidRecords = (response) => {
    setPaidLength(response.recordsCount);
  };

  const handleBudgetRequestLength = (response) => {
    setBudgetLength(response);
  };

  // Register event listeners
  socket.on("receive_payable_length", handlePayableLength);
  socket.on("receive_paid_records", handlePaidRecords);
  socket.on("receive_budget_request_length", handleBudgetRequestLength);

  // Cleanup function to remove listeners when component unmounts or socket changes
  return () => {
    socket.off("receive_payable_length", handlePayableLength);
    socket.off("receive_paid_records", handlePaidRecords);
    socket.off("receive_budget_request_length", handleBudgetRequestLength);
  };

}, [socket]);


// REMOVE NOTIFICATION
const handleCreateInvoiceClick = () => {
  setNotifications((prevState) => ({
    ...prevState,
    createInvoice: 0, // SET COUNT 0 WHEN CLICKED
    hasNotifications: prevState.accountRequest > 0, // UPDATE
  }));
};

// REMOVE NOTIFICATION
const handleAccountRequestClick = () => {
  setNotifications((prevState) => ({
    ...prevState,
    accountRequest: 0, // SET COUNT 0 WHEN CLICKED
    hasNotifications: prevState.createInvoice > 0, // UPDATE
  }));
};

const [isCollapsed, setIsCollapsed] = useState(false);
const toggleSidebar = () => {
  setIsCollapsed((prev) => !prev);
};




  return (
    <>
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
        className="flex items-center gap-2 cursor-pointer mb-4 justify-center"
        aria-label="Dashboard Logo"
      >
        <img src={JJM} alt="Dashboard logo" className="w-[100px] h-[100px]" />
        {!isCollapsed && <Link to="" ></Link>}
      </div>

    {/* DASHBOARD PUTANGINAMO */}
    <ul className="menu rounded-box w-56">
  {isCollapsed && <MdOutlineScreenshotMonitor className="w-5 h-5" />}
  {!isCollapsed && (
    <li>
      <NavLink
        to="/Dashboard/overview"
        className="relative flex items-center hover:text-blue-500"
        activeClassName="bg-gray-200"
      >
        <summary className="flex items-center">
          <MdOutlineScreenshotMonitor className="w-5 h-5 mr-2" /> 
          Dashboard
        </summary>
      </NavLink>
    </li>
  )}
</ul>




      {/* Apps */}
      <div className="mb-2">
        <p
          className={`text-gray-500 mb-2 font-semibold text-sm ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          Modules
        </p>
        
        {(userData.role === 'CHIEF FINANCIAL OFFICER' || userData.role === 'FINANCE MANAGER' || userData.role === 'ADMIN') && (
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
                              <li className="flex hover:text-blue-500">
                                <NavLink to="viewCollection" activeClassName="text-blue-500">
                                  ● View Collection
                                </NavLink>
                              </li>
                           </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>
        )}


             {/* Budget Management */}
{(userData.role === 'CHIEF FINANCIAL OFFICER' || userData.role === 'FINANCE MANAGER' ||  userData.role === 'ADMIN') && (
         <ul className="menu  rounded-box w-56">
          {isCollapsed && <TbPigMoney className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><TbPigMoney className="w-5 h-5" />Budget Management
              {budgetLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}
              </summary>
                <ul>
                 <li>
                    <details open>
                      <summary><TbZoomMoney/>Manage Budget
                      {budgetLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}</summary>
                          <ul>
                            <li className="hover:text-blue-500">
                              <NavLink to="budgetRequest" activeClassName="text-blue-500">
                                ● Budget Requests
                                {budgetLength > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 text-center leading-4 ml-2">{budgetLength >= 100 ? "99+" :  budgetLength }</span>
                           )}
                              </NavLink>
                            </li>
                            <li className="hover:text-blue-500">
                              <NavLink to="budgetReports" activeClassName="text-blue-500">
                                ● Budget Reports
                              </NavLink>
                            </li>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>
)}
        
            {/* Accounts Receivable */}
            {(userData.role === 'CHIEF FINANCIAL OFFICER' || userData.role === 'ACCOUNTANT' || userData.role === 'ACCOUNTANT' ||  userData.role === 'ADMIN') && (           
            <ul className="menu rounded-box w-56">
      {isCollapsed && <RiUserReceived2Fill className="w-5 h-5" />}
      {!isCollapsed && (
        <li>
          <details open>
            <summary>
              <RiUserReceived2Fill className="w-5 h-5" />
              Accounts Receivable
              {notifications.createInvoice > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}
            </summary>

            <ul>
              <li>
                <details open>
                  <summary>
                    <FaFileInvoiceDollar />
                    Invoice Generation
              {notifications.createInvoice > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}
                  </summary>

                  <ul>
                    <li className="hover:text-blue-500">
                        <NavLink to="createInvoice" activeClassName="text-blue-500">
                          ● Invoice Request
                            {notifications.createInvoice > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 text-center leading-4 ml-2">{notifications.createInvoice}</span>
                           )}
                        </NavLink>
                    </li>
                    <li className="hover:text-blue-500">
                      <NavLink to="pendingInvoice" activeClassName="text-blue-500">
                        ● View Pending Invoice
                      </NavLink>
                    </li>
                    <li className="hover:text-blue-500">
                      <NavLink to="paidInvoice" activeClassName="text-blue-500">
                        ● Paid/Closed Invoice
                      </NavLink>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
        </li>
      )}
    </ul>
            )}
        {/* Accounts Payable */}
        {(userData.role === 'CHIEF FINANCIAL OFFICER' || userData.role === 'ACCOUNTANT' ||  userData.role === 'ADMIN') && (           
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <TbCreditCardPay className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><TbCreditCardPay className="w-5 h-5" /> Accounts Payable
              {payableLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><MdOutlinePayments/>Manage Payables
                      {payableLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}</summary>
                          <ul>
                            <li className="hover:text-blue-500">
                              <NavLink to="reviewPayables" activeClassName="text-blue-500">
                                ● Review Payables
                                {payableLength > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 text-center leading-4 ml-2">{payableLength >= 100 ? "99+" : payableLength}</span>
                           )}
                              </NavLink>
                            </li>
                            <li className="hover:text-blue-500">
                              <NavLink to="approveRejectPayables" activeClassName="text-blue-500">
                                ● Approve/Reject Payables
                              </NavLink>
                            </li>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>
        )}

        {/* General Ledger */}
        {(userData.role === 'CHIEF FINANCIAL OFFICER' ||  userData.role === 'FINANCE MANAGER' || userData.role === 'ADMIN') && (           
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <FaList className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><FaList className="w-5 h-5" />General Ledger
              {paidLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}</summary>
                <ul>
                 <li>
                    <details open>
                      <summary><AiOutlineAudit/>Internal Audit and Controls
                      {paidLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
              )}</summary>
                          <ul>
                          <li className="hover:text-blue-500">
                              <NavLink to="reviewPaymentTransactions" activeClassName="text-blue-500">
                                ● Review Payment Transactions
                                {paidLength > 0 && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 text-center leading-4 ml-2">
                                    {paidLength >= 100 ? "99+" : paidLength}
                                  </span>)}
                              </NavLink>
                            </li>
                            <li className="hover:text-blue-500">
                              <NavLink to="viewAuditHistory" activeClassName="text-blue-500">
                                ● View Audit History
                              </NavLink>
                            </li>
                          </ul>
                    </details>
                </li>

                <li>
                    <details open>
                      <summary><TbReportSearch/>Financial Reporting</summary>
                          <ul>
                            <li className="hover:text-blue-500">
                              <NavLink to="financialReports" activeClassName="text-blue-500">
                                ● Financial Reports
                              </NavLink>
                            </li>
                            <li className="hover:text-blue-500">
                              <NavLink to="transactionRecords" activeClassName="text-blue-500">
                                ● Transaction Records
                              </NavLink>
                            </li>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>
        )}
        {/* Accounts Management */}
        {(userData.role === 'ADMIN' || userData.role === 'CHIEF FINANCIAL OFFICER')  && (
        <ul className="menu  rounded-box w-56">
          {isCollapsed && <MdAccountCircle className="w-5 h-5" />}   
          {!isCollapsed && 
            <li>
            <details open>
              <summary><MdAccountCircle className="w-5 h-5" />Accounts Management
                    {notifications.accountRequest > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
                    )}
              </summary>
                <ul>
                 <li>
                    <details open>
                      <summary><MdManageAccounts/>Manage Accounts
                          {notifications.accountRequest > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
                          )}
                      </summary>
                            {/* Account Request */}
                          <ul>
                            <li className="hover:text-blue-500">
                              <NavLink to="accountCreation" activeClassName="text-blue-500">
                                ● Account Requests
                                  {notifications.accountRequest > 0 && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 text-center leading-4 ml-2">
                                    {notifications.accountRequest}
                                  </span>)}
                              </NavLink>
                            </li>
                            <li className="hover:text-blue-500">
                              <NavLink to="viewAllAccounts" activeClassName="text-blue-500">
                                ● View All Accounts
                              </NavLink>
                            </li>
                          </ul>
                    </details>
                </li>
              </ul>
          </details>
          </li>
          }
        </ul>
        )}

      {/* Audit putanginamo raffy */}
      {(userData.role === 'CHIEF FINANCIAL OFFICER' || userData.role === 'ADMIN') && (      
<ul className="menu rounded-box w-56">
  {isCollapsed && <SiAdobeaudition className="w-5 h-5" />}
  {!isCollapsed && (
    <li>
      <NavLink
        to="auditTrails"
        className="relative flex items-center hover:text-blue-500"
        activeClassName="bg-gray-200"
      >
        <summary className="flex items-center">
          <SiAdobeaudition className="w-5 h-5 mr-2" />
          Audit Trails
        </summary>
      </NavLink>
    </li>
  )}
</ul>
      )}

{/* Nagdedetect ng burat */}
{(userData.role === 'CHIEF FINANCIAL OFFICER' || userData.role === 'ADMIN') && (   
        <ul className="menu rounded-box w-56">
  {isCollapsed && <VscBracketError className="w-5 h-5" />}
  {!isCollapsed && (
    <li>
      <NavLink
        to="anomalyDetection"
        className="relative flex items-center hover:text-blue-500"
        activeClassName="bg-gray-200"
      >
        <summary className="flex items-center">
          <VscBracketError className="w-5 h-5 mr-2" /> 
          Anomaly Detection
        </summary>
      </NavLink>
    </li>
  )}
</ul>
)}
        
      </div>
    </div>
    </>
  );
};

export default Sidebar;
