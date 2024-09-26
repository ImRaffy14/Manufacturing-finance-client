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
import { MdOutlineChat } from "react-icons/md";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
   // Sample data for financial chart
   const financialChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 700, 800, 600, 900, 1100],
        borderColor: "#10B981", // Emerald green line color
        backgroundColor: "rgba(16, 185, 129, 0.1)", // Light green background
        fill: true,
        tension: 0.4,
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
    rejectedInvoices: 20,
    detectedAnomalies: 10,
  });

  useEffect(() => {
    const fetchDashboardData = () => {
      // Fetch and set data here
    };

    fetchDashboardData();
  }, []);

  return (
    <>

    <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
          {/* Account Requests*/}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Account Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaUsers className="text-gray-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{dashboardData.accountRequests}</p>
            </div>
          </div>

           {/* Invoice Requests*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Invoice Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaFileInvoiceDollar  className="text-gray-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{dashboardData.invoiceRequests}</p>
            </div>
          </div>

           {/* Approved Invoices*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Approved Invoices</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaCheckCircle   className="text-gray-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{dashboardData.approvedInvoices}</p>
            </div>
          </div>

          {/* Rejected Invoices*/}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Invoice Requests</p>
            </div>
            <div className="flex gap-3 my-3">
            <FaTimesCircle    className="text-gray-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{dashboardData.rejectedInvoices}</p>
            </div>
          </div>

           {/* Detected Anomalies*/}
           <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-md">Detected Anomalies</p>
            </div>
            <div className="flex gap-3 my-3">
            <MdError className="text-gray-600 text-2xl my-2" />
              <p className="text-4xl font-bold">{dashboardData.rejectedInvoices}</p>
            </div>
          </div>
      </div>

      <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
          {/* Sales Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Sales</p>
              <GrMoney className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">4859</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 18.2%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
                +47 <span className="text-gray-500">than past week</span>
              </p>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Revenue</p>
              <HiOutlineCurrencyDollar className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">$537.83</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 10.8%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
                +$128.58 <span className="text-gray-500">than past week</span>
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
              <p className="text-3xl font-bold">$219.65</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 9.1%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
                +$88.67 <span className="text-gray-500">than past week</span>
              </p>
            </div>
          </div>

        </div>
        <div className="p-4">
        {/* Financial chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Financial Overview</h3>
          <Line data={financialChartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;