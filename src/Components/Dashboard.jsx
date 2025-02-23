import React, { useState, useEffect } from "react";
import AreaChart from '../Components/ReCharts/AreaChart';
import SalesPieChart from '../Components/ReCharts/SalesPieChart';
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaUsers } from 'react-icons/fa';
import { MdError } from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { GrMoney } from "react-icons/gr";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbCreditCardPay } from "react-icons/tb";
import { FiRepeat } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { BsFillBarChartLineFill } from "react-icons/bs";

function Dashboard() {
  const [budgetRequest, setBudgetRequest] = useState(0);
  const [pendingPayables, setPendingPayables] = useState(0);
  const [invoicePending, setInvoicePending] = useState(0);
  const [totalAnomalies, setTotalAnomaliesa] = useState(0)
  const [saleVolume, setSaleVolume] = useState([]);
  const [netIncome, setNetIncome] = useState([]);
  const [collectionAnalytics, setCollectionAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const formatCurrency = (value) => `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const socket = useSocket();

  const [dashboardData, setDashboardData] = useState({
    accountRequests: 50,
    invoiceRequests: 120,
    detectedAnomalies: 10,
  });

  const formatDateString = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const parts = dateString.split('/');
    if (parts.length !== 3) return 'Invalid Date Format';
    const month = parseInt(parts[0], 10);
    const year = parts[2];

    const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    return `${monthNames[month - 1]} ${year}`;
  };

  useEffect(() => {
    socket.emit('get_payable_length', { msg: "get payable length" });
    socket.emit("get_pending_invoice", { msg: "get pending invoice" });
    socket.emit("get_budget_request_length", { msg: "get budget request records length" });
    socket.emit("get_dashboard_analytics", { msg: "get dashboard analytics" });
    socket.emit("get_collection_analytics", { msg: "get collection analytics" });
    socket.emit('get_total_anomalies')

  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handlePayableLength = (response) => {
      setPendingPayables(response);
    };

    const handleBudgetRequestLength = (response) => {
      setBudgetRequest(response);
    };

    const handlePendingInvoice = (response) => {
      setInvoicePending(response.pendingSalesCount.totalCount);
    };

    const handlesDashboardAnalytics = (response) => {
      const salesVolume = response.map((response) => ({
        Month: formatDateString(response.date),
        Volume: response.salesVolume
      }));

      const netIncome = response.map((response) => ({
        _id: formatDateString(response.date),
        Amount: response.netIncome
      }));

      setSaleVolume(salesVolume);
      setNetIncome(netIncome);
    };

    const handlesCollectionAnalytics = (response) => {
      setCollectionAnalytics(response);
      setIsLoading(false);
    };

    const handleTotalAnomolies = (response) => {
      const totalAnomalies = response.totalAnomaly
      const totalOnInvestigate = response.processedTotal.totalOnInvestigate
  
      const total = totalAnomalies + totalOnInvestigate
  
      setTotalAnomaliesa(total)
    }

    socket.on('receive_total_anomalies', handleTotalAnomolies)
    socket.on("receive_payable_length", handlePayableLength);
    socket.on("receive_budget_request_length", handleBudgetRequestLength);
    socket.on("receive_pending_invoice", handlePendingInvoice);
    socket.on("receive_dashboard_analytics", handlesDashboardAnalytics);
    socket.on("receive_collection_analytics", handlesCollectionAnalytics);

    return () => {
      socket.off("receive_payable_length", handlePayableLength);
      socket.off("receive_budget_request_length", handleBudgetRequestLength);
      socket.off("receive_pending_invoice", handlePendingInvoice);
      socket.off("receive_dashboard_analytics");
      socket.off("receive_collection_analytics");
      socket.off("receive_total_anomalies")
    };
  }, [socket]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-[520px] w-full"></div>
        <div className="skeleton h-20 w-full"></div>
        <div className="skeleton h-20 w-full"></div>
        <div className="skeleton h-20 w-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="bg-white/75 shadow-xl rounded-lg p-6">
          <h1 className="text-xl font-bold">Overview</h1>
          <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">

            <Link to="/Dashboard/createPurchaseOrder">
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-black font-semibold text-md">Purchase Order Requests</p>
                </div>
                <div className="flex gap-3 my-3">
                  <FaFileInvoiceDollar className="text-blue-600 text-2xl my-2" />
                  <p className="text-4xl text-black font-bold">{dashboardData.invoiceRequests}</p>
                </div>
              </div>
            </Link>

            <Link to="/Dashboard/reviewPayables">
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
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
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-black font-semibold text-md">Budget Requests</p>
                </div>
                <div className="flex gap-3 my-3">
                  <FaMoneyCheckDollar className="text-blue-600 text-2xl my-2" />
                  <p className="text-4xl text-black font-bold">{budgetRequest}</p>
                </div>
              </div>
            </Link>

            <Link to="/Dashboard/pendingPurchaseOrder">
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-black font-semibold text-md">On Process Purchase Orders</p>
                </div>
                <div className="flex gap-3 my-3">
                  <FiRepeat className="text-green-600 text-2xl my-2" />
                  <p className="text-4xl text-black font-bold">{invoicePending}</p>
                </div>
              </div>
            </Link>

            <Link to="/Dashboard/anomalyDetection">
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-black font-semibold text-md">Detected Anomalies</p>
                </div>
                <div className="flex gap-3 my-3">
                  <MdError className="text-red-600 text-2xl my-2" />
                  <p className="text-4xl text-black font-bold">{totalAnomalies}</p>
                </div>
              </div>
            </Link>

          </div>
        </div>

        <div className="mt-5">
          <div className="bg-white/75 shadow-xl rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Analytics</h3>
            <h2 className="text-xl font-bold mt-10">Month of {currentMonth}</h2>
            <div className="flex flex-wrap gap-4">  
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-sm">Sales Volume</p>
                  <BsFillBarChartLineFill className="text-green-600 text-xl" />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl font-bold">{collectionAnalytics.salesVolume}</p>
                  <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                    {collectionAnalytics.salesVolumePercentageChangeArrow === "↑" ? <IoIosArrowUp className="text-green-700" /> : <IoIosArrowDown className="text-red-700" />} {collectionAnalytics.salesVolumePercentageChange}%
                  </p>
                </div>
                <div className="my-3">
                  <p className="text-green-700 font-semibold">
                    {collectionAnalytics.salesVolumeDifferenceArrow === "↑" ? "+" : "-"} {collectionAnalytics.salesVolumeDifference} <span className="text-gray-500">than past month</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/75 shadow-xl w-[350px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-sm">Sales</p>
                  <HiOutlineCurrencyDollar className="text-green-600 text-xl" />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl font-bold">{formatCurrency(collectionAnalytics.totalInflows)}</p>
                  <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                    {collectionAnalytics.inflowPercentageChangeArrow === "↑" ? <IoIosArrowUp className="text-green-700" /> : <IoIosArrowDown className="text-red-700" />} {collectionAnalytics.inflowPercentageChange}%
                  </p>
                </div>
                <div className="my-3">
                  <p className="text-green-700 font-semibold">
                    {collectionAnalytics.inflowDifferenceArrow === "↑" ? "+" : "-"} {formatCurrency(collectionAnalytics.inflowDifference)}<span className="text-gray-500"> than past month</span>
                  </p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[350px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-sm">Spending</p>
                  <RiPassPendingLine className="text-red-600 text-xl" />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl font-bold">{formatCurrency(collectionAnalytics.totalOutflows)}</p>
                  <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
                    {collectionAnalytics.outflowPercentageChangeArrow === "↑" ? <IoIosArrowUp className="text-red-700" /> : <IoIosArrowDown className="text-red-700" />} {collectionAnalytics.outflowPercentageChange}%
                  </p>
                </div>
                <div className="my-3">
                  <p className="text-red-700 font-semibold">
                    {collectionAnalytics.outflowDifferenceArrow === "↑" ? "+" : "-"} {formatCurrency(collectionAnalytics.outflowDifference)} <span className="text-gray-500">than past month</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="bg-white shadow-xl w-full p-8 rounded-lg hover:shadow-xl">
                <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">Product Sales Volume</h4>
                <h4 className="text-md text-gray-500 mb-[80px] text-center">Shows the total number of products sold during the selected period, providing a clear view of overall product movement.</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={saleVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Volume" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="bg-white w-full shadow-xl p-10 rounded-lg hover:shadow-xl mb-10">
                <h1 className="text-gray-700 font-semibold text-xl mb-4 text-center">Net Income</h1>
                <h4 className="text-md text-gray-500 mb-[80px] text-center">Shows the company’s profit after expenses are deducted from total sales, offering a snapshot of overall financial health.</h4>
                <AreaChart
                  data={netIncome}
                  dataKey1="Amount"
                  color1="rgb(74 222 128)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;


/*<Link to="/Dashboard/accountCreation">
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-black font-semibold text-md">Account Requests</p>
                </div>
                <div className="flex gap-3 my-3">
                  <FaUsers className="text-blue-600 text-2xl my-2" />
                  <p className="text-4xl text-black font-bold">{dashboardData.accountRequests}</p>
                </div>
              </div>
            </Link> */