   import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
const { rowData } = location.state || {}; // Extract rowData from location.state
import { RiPassPendingLine } from "react-icons/ri";
import { FaIndustry } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { IoIosArrowUp } from "react-icons/io";  
import { PiHandWithdraw } from "react-icons/pi";
import { FaRegPlusSquare } from "react-icons/fa";
import AreaChart from '../Components/ReCharts/AreaChart';
import { PiCoinsFill } from "react-icons/pi";
import { MdAutoGraph } from "react-icons/md";

function reviewViewCollection() {
    const location = useLocation(); // Get the location object
    const { rowData } = location.state || {}; // Extract rowData from location.state
    if (!rowData) {
      return <p>No data available.</p>;
    }

    const [cashAmount, setCashAmount] = useState(0);
    const [salesAmount, setSalesAmount] = useState(0);
    const [spentAmount, setSpent] = useState(0);
    const [netIncome, setNetIncome] = useState(0);
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const formatCurrency = (value) => {
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      };

      const inflowsData = [
        { name: 'First', In: 0 },
        { name: 'Second', In: 6000 },
        { name: 'Third', In: 1000 },
        { name: 'Fourth', In: 6000 },
      ];
      
      const outflowsData = [
        { name: 'First', Out: 2000 },
        { name: 'Second',Out: 2500 },
        { name: 'Fourth', Out: 1800 },
        { name: 'Fourth', Out: 3200 },
      ];

    
    const getMonthNames = () => {
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth(); // getMonth() returns month index (0 - January, 11 - December)
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
    
      const currentMonth = months[currentMonthIndex];
      const nextMonth = months[(currentMonthIndex + 1) % 12]; // Get the next month, using modulo for December -> January
    
      return { currentMonth, nextMonth };
    };
    
    const { currentMonth, nextMonth } = getMonthNames();
    
  return (
 <>
  <div className="max-w-screen-2xl mx-auto mt-8  mb-10">
         <div className="breadcrumbs text-xl mt-4">
          <ul>
            <li><a><Link to="/Dashboard/viewCollection">Return</Link></a></li>
            <li><a className="text-blue-500 underline">Documents</a></li>
          </ul>
        </div>
    {/* Financial chart */}
    <div className="bg-white/75 shadow-xl rounded-lg p-6 ">
    <div className="flex mb-[80px]">
    <h1 className="text-2xl font-semibold">Details for ID: <strong>{rowData._id}</strong></h1>
    </div>
      <h2 className="text-xl font-bold mb-4">Month of {currentMonth}</h2>
        <div className="flex gap-4">
            {/* Net Income Card */}
           <div className="bg-white/75 shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Net Income</p>
              <MdAutoGraph className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(rowData.netIncome)}</p>
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
            {/* Revenue Card */}
           <div className="bg-white/75 shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Sales</p>
              <PiCoinsFill className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(salesAmount)}</p>
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
          <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Spent</p>
              <RiPassPendingLine className="text-red-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(spentAmount)}</p>
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

        {/* Bar Charts Section */}
        <div className="mt-[60px] mb-10">
          <h3 className="text-xl font-bold mb-6">Cash Flow</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Inflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold text-gray-700 mb-5 text-center">Inflows</h4>
              <AreaChart
            data={inflowsData}
            dataKey1="In"
            color1="rgb(74 222 128)"
            
          />
            </div>

            {/* Outflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold text-gray-700 mb-5 text-center">Outflows</h4>
          <AreaChart
            data={outflowsData}
            dataKey1="Out"
            color1="rgb(248 113 113)"
            
          />
            </div>
          </div>
        </div>
      </div>
      </div>
</>
  )
}

export default reviewViewCollection
