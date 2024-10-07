import React, { useState, useEffect } from "react";
import { FaUserCheck, FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaUsers } from 'react-icons/fa';
import { MdError } from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt, MdRemoveRedEye } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdOutlineChat } from "react-icons/md";
import { TbCreditCardPay } from "react-icons/tb";
import { FiRepeat } from "react-icons/fi";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [budgetRequest, setBudgetRequest] = useState(0)
  const [invoicePending, setInvoicePending] = useState(0)
  const [salesAmount, setSalesAmount] = useState(0);
  const [revenueAmount, setRevenueAmount] = useState(0);
  const [spendingAmount, setSpendingAmount] = useState(0);
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const socket = useSocket()


   const financialChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 700, 800, 600, 900, 1100],
        borderColor: "#10B981", // Emerald green line color
        backgroundColor: "rgba(16, 185, 129, 0.1)", // Light green background
        fill: true,
        tension: 0,
      },
    ],
  };

  const spendingChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 700, 800, 600, 900, 1100],
        borderColor: "#D22B2B", // Emerald green line color
        backgroundColor: "rgba(16, 185, 129, 0.1)", // Light green background
        fill: true,
        tension: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  
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

    return
  }, []);


  useEffect(() => {
    if(!socket) return;
    
    socket.on("receive_payable_length", (response) => {
      setBudgetRequest(response)

    socket.on("receive_pending_invoice", (response) => {
      setInvoicePending(response.pendingSalesCount.totalCount);
    })
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
              <p className="text-4xl text-black font-bold">{budgetRequest}</p>
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
          <div className="flex gap-4">
          <div className="bg-white w-1/2 shadow-lg p-5 rounded-lg mt-3  hover:shadow-xl">
          <h1 className="text-gray-600 font-semibold text-xl p-4">Revenue</h1>
          <Line data={financialChartData} options={chartOptions} />
          </div>
          <div className="bg-white w-1/2 shadow-lg p-5 rounded-lg mt-3  hover:shadow-xl">
          <h1 className="text-gray-600 font-semibold text-xl p-4">Spending</h1>
          <Line data={spendingChartData} options={chartOptions} />
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;