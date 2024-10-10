import React, { useState, useEffect } from "react";
import AreaChart from '../Components/ReCharts/AreaChart';
import SalesPieChart from '../Components/ReCharts/SalesPieChart';
import { FaFileInvoiceDollar} from "react-icons/fa";
import { FaUsers } from 'react-icons/fa';
import { MdError } from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { GrMoney } from "react-icons/gr";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbCreditCardPay } from "react-icons/tb";
import { FiRepeat } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";


function Dashboard() {
  const [budgetRequest, setBudgetRequest] = useState(0)
  const [pendingPayables, setPendingPayables] = useState(0)
  const [invoicePending, setInvoicePending] = useState(0)
  const [salesAmount, setSalesAmount] = useState(0);
  const [revenueAmount, setRevenueAmount] = useState(0);
  const [spendingAmount, setSpendingAmount] = useState(0);
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const socket = useSocket()
  
 

  const sales = [
    { name: 'January', amount: 4000 },
    { name: 'February', amount: 3000 },
    { name: 'March', amount: 5000 },
    { name: 'April', amount: 6000 },
    { name: 'May', amount: 7000 },
    { name: 'June', amount: 8000 },
    { name: 'July', amount: 9000 },
    { name: 'August', amount: 8500 },
    { name: 'September', amount: 7500 },
    { name: 'October', amount: 6000 },
    { name: 'November', amount: 9500 },
    { name: 'December', amount: 10000 },
  ];
// Revenue Data
const revenue = [
  { name: 'Jan', product1: 4500 },
  { name: 'Feb', product1: 3200 },
  { name: 'Mar', product1: 2500 },
  { name: 'Apr', product1: 3000 },
  { name: 'May', product1: 2100 },
  { name: 'Jun', product1: 6100 },
  { name: 'Jul', product1: 4100 },
  { name: 'Aug', product1: 1100 },
  { name: 'Sep', product1: 8100 },
  { name: 'Oct', product1: 1100 },
  { name: 'Nov', product1: 2100 },
  { name: 'Dec', product1: 6100 },
 
];

// Spending Data
const spending = [
  { name: 'Jan', expense1: 4500 },
  { name: 'Feb', expense1: 3200 },
  { name: 'Mar', expense1: 2500 },
  { name: 'Apr', expense1: 3000 },
  { name: 'May', expense1: 2100 },
  { name: 'Jun', expense1: 4000 },
  { name: 'Jul', expense1: 5000 },
  { name: 'Aug', expense1: 4600 },
  { name: 'Sepr', expense1: 3700 },
  { name: 'Oct', expense1: 3400 },
  { name: 'Nov', expense1: 5200 },
  { name: 'Dec', expense1: 6000 },
];

  // sample data
  const [dashboardData, setDashboardData] = useState({
    accountRequests: 50,
    invoiceRequests: 120,
    approvedInvoices: 100,
    detectedAnomalies: 10,
  });


  useEffect(() => {
    socket.emit('get_payable_length', {msg: "get payable length"})
    socket.emit("get_pending_invoice", {msg: "get pending invoice"})
    socket.emit("get_budget_request_length", {msg: "get budget request records length"})

  }, []);


  useEffect(() => {
    if(!socket) return;
    
  socket.on("receive_payable_length", (response) => {
    setPendingPayables(response)
  })

  socket.on("receive_budget_request_length", (response) => {
    setBudgetRequest(response)
  })

  socket.on("receive_pending_invoice", (response) => {
    setInvoicePending(response.pendingSalesCount.totalCount);
  })

  
  }, [socket])

  return (
    <>
    <div className="p-4">
 <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Overview</h1>
    <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
      
          {/* Account Requests*/}
          <Link to="/Dashboard/accountCreation">
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold text-md">Account Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaUsers className="text-blue-600 text-2xl my-2" />
              <p className="text-4xl text-black font-bold">{dashboardData.accountRequests}</p>
            </div>
          </div>
          </Link>

          <Link to="/Dashboard/createInvoice">
           {/* Invoice Requests*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold text-md">Invoice Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaFileInvoiceDollar  className="text-blue-600 text-2xl my-2" />
              <p className="text-4xl text-black font-bold">{dashboardData.invoiceRequests}</p>
            </div>
          </div>
          </Link>

          <Link to="/Dashboard/reviewPayables">
           {/* Budget Requests*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold text-md">Pending Payables</p>
            </div>
            <div className="flex gap-3 my-3">
            <TbCreditCardPay className="text-blue-600 text-2xl my-2" />
              <p className="text-4xl text-black font-bold">{pendingPayables}</p>
            </div>
          </div>
          </Link>

          <Link to="/Dashboard/budgetRequest">
           {/* Budget Requests*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold text-md">Budget Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaMoneyCheckDollar className="text-blue-600 text-2xl my-2" />
              <p className="text-4xl text-black font-bold">{budgetRequest}</p>
            </div>
          </div>
          </Link>

          <Link to="/Dashboard/pendingInvoice">
          {/* Rejected Invoices*/}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold text-md">On Process Invoice</p>
            </div>
            <div className="flex gap-3 my-3">
            <FiRepeat className="text-green-600 text-2xl my-2" />
              <p className="text-4xl text-black font-bold">{invoicePending}</p>
            </div>
          </div>
          </Link>

          <Link to="/Dashboard/anomalyDetection">
           {/* Detected Anomalies*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-black font-semibold text-md">Detected Anomalies</p>
            </div>
            <div className="flex gap-3 my-3">
            <MdError className="text-red-600 text-2xl my-2" />
              <p className="text-4xl text-black font-bold">{dashboardData.detectedAnomalies}</p>
            </div>
          </div>
          </Link>
      </div>
     </div>

        </div>
        <div className="p-4">
        {/* Financial chart */}
        <div className="bg-white/75 shadow-xl rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Analytics</h3>
          <div className="flex gap-4">
            {/* Sales Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Sales</p>
              <GrMoney className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(salesAmount)}</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 18.2%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
              +{formatCurrency(231)} <span className="text-gray-500">than past month</span>
              </p>
            </div>
          </div>

           {/* Revenue Card */}
           <div className="bg-white/75 shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Revenue</p>
              <HiOutlineCurrencyDollar className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(revenueAmount)}</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 10.8%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
              +{formatCurrency(12313)}<span className="text-gray-500"> than past month</span>
              </p>
            </div>
          </div>

          {/* Spending Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Spending</p>
              <RiPassPendingLine className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(spendingAmount)}</p>
              <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-red-700" /> 9.1%
              </p>
            </div>
            <div className="my-3">
              <p className="text-red-700 font-semibold">
                +{formatCurrency(3213)} <span className="text-gray-500">than past month</span>
              </p>
            </div>
          </div>
          </div>
         
         <div className="flex gap-4 mt-6">
  {/* First chart (BarChart) */}
  <div className="bg-white shadow-lg w-1/2 p-8 rounded-lg hover:shadow-xl">
    <h4 className="text-lg font-semibold text-gray-700 mb-3">Total Sales</h4>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={sales}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Second chart (SalesPieChart) */}
  <div className="bg-white shadow-lg w-1/2 p-8 rounded-lg hover:shadow-xl">
    <h4 className="text-lg font-semibold text-gray-700 mb-3">Product Sales</h4>
    <SalesPieChart />
  </div>
</div>

      <div className="flex gap-4 mt-6">
        <div className="bg-white w-1/2 shadow-lg p-5 rounded-lg hover:shadow-xl">
          <h1 className="text-gray-600 font-semibold text-xl p-4">Revenue</h1>
          <AreaChart
            data={revenue}
            dataKey1="product1"
            color1="rgb(74 222 128)"
          />
        </div>

        <div className="bg-white w-1/2 shadow-lg p-5 rounded-lg hover:shadow-xl">
          <h1 className="text-gray-600 font-semibold text-xl p-4">Spending</h1>
          <AreaChart
            data={spending}
            dataKey1="expense1"
            color1="rgb(248 113 113)"
            
          />
        </div>
      </div>
    </div>
        </div>
      
    </>
  );
}

export default Dashboard;