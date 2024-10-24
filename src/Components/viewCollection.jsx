
import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { RiPassPendingLine } from "react-icons/ri";
import { PiCoinsFill } from "react-icons/pi";
import { BsCashCoin } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";  
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PiHandWithdraw } from "react-icons/pi";
import { PiHandDeposit } from "react-icons/pi";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaRegMinusSquare } from "react-icons/fa";
import AreaChart from '../Components/ReCharts/AreaChart';
import { useSocket } from '../context/SocketContext'
import { toast } from 'react-toastify'


function viewCollection({ userData }) {
  const [data, setData] = useState([])
  const [cashAmount, setCashAmount] = useState(0);
  const [salesAmount, setSalesAmount] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [inflowsChart, setInflowsChart] = useState([])
  const [outflowsChart, setOutflowsChart] = useState([])
  const [inflowDiff, setInflowDiff] = useState(0)
  const [inflowPercentage, setInflowPercentage] = useState(0)
  const [inflowDifferenceArrow, setInflowDifferenceArrow] = useState("")
  const [inflowPercentageArrow, setInflowPercentageArrow] = useState("")
  const [outflowDifferenceArrow, setOutflowDifferenceArrow] = useState("")
  const [outflowPercentageArrow, setOutflowPercentageArrow] = useState("")
  const [outflowDiff, setOutflowDiff] = useState(0)
  const [outflowPercentage, setOutflowPercentage] = useState(0)
  const [withdraw, setWithdraw] = useState(0);
  const navigate = useNavigate();
  const [totalCash, setTotalCash] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const socket = useSocket()

  // INFLOWS ANALYTICS
  const currentDate = new Date();
  const currentWeek = Math.ceil((currentDate.getDate() + 6 - currentDate.getDay()) / 7); // Current week number of the month
  

  let inflowsData = inflowsChart && inflowsChart.length > 0 
    ? inflowsChart.map((inflows) => ({
        _id: `week ${inflows._id}`, 
        Amount: inflows.totalInflowAmount
      }))
    : [];
  
  const latestWeek = inflowsChart.length > 0
    ? Math.max(...inflowsChart.map(inflow => inflow._id)) 
    : currentWeek;
  
  const startWeek = latestWeek - 3; 
  const completeWeeks = Array.from({ length: 4 }, (_, i) => startWeek + i).map(week => `week ${week}`);
  
  // Create the final output by checking against completeWeeks
  const finalInflowsData = completeWeeks.map(week => {
    const weekData = inflowsData.find(inflow => inflow._id === week);
    
    if (weekData) {

      return weekData;
    } else if (week === `week ${currentWeek}`) {

      return { _id: week, Amount: 0 };
    } else {

      return { _id: week, Amount: 0 };
    }
  });


  // OUTFLOWS ANALYTICS
  let outflowsData = outflowsChart && outflowsChart.length > 0 
  ? outflowsChart.map((outflows) => ({
      _id: `week ${outflows._id}`, 
      Amount: outflows.totalOutflowAmount
    }))
  : [];


  const latestWeekOutflows = outflowsChart.length > 0
    ? Math.max(...outflowsChart.map(outflow => outflow._id)) 
    : currentWeek;


  const startWeekOutflows = latestWeekOutflows - 3; 
  const completeWeeksOutflows = Array.from({ length: 4 }, (_, i) => startWeekOutflows + i).map(week => `week ${week}`);

  // Create the final output by checking against completeWeeks
  const finalOutflowsData = completeWeeksOutflows.map(week => {
    const weekData = outflowsData.find(outflow => outflow._id === week);
    
    if (weekData) {

      return weekData;
    } else if (week === `week ${currentWeek}`) {

      return { _id: week, Amount: 0 };
    } else {

      return { _id: week, Amount: 0 };
    }
  });

  

  const columns = [
    { name: 'ID', selector: row => row._id },
    { name: 'Date', selector: row => row.date },
    { name: 'Total Cash Inflow', selector: row => formatCurrency(row.totalInflows) },
    { name: 'Total Cash Outflow', selector: row => formatCurrency(row.totalOutflows) },
    { name: 'Net Income', selector: row => formatCurrency(row.netIncome)},
  ];


  //FETCHING DATA
  useEffect(() => {
    socket.emit("get_total_cash", {msg: "get total cash"})
    socket.emit("get_collection_analytics", {msg: "get collection analytics"})
    socket.emit("get_monthly_collection_records", {msg: "get monthly collection records"})
    socket.emit("get_monthly_records", {msg: "get monthly records"})
  }, [])
  
  useEffect(() => {

    if(!socket) return;

    const handlesCollectionAnalytics = (response) => {
      setSalesAmount(response.totalInflows)
      setSpentAmount(response.totalOutflows)
      setInflowsChart(response.inflows)
      setOutflowsChart(response.outflows)
      setInflowDiff(response.inflowDifference)
      setInflowPercentage(response.inflowPercentageChange)
      setOutflowDiff(response.outflowDifference)
      setOutflowPercentage(response.outflowPercentageChange)
      setInflowDifferenceArrow(response.inflowDifferenceArrow)
      setInflowPercentageArrow(response.inflowPercentageChangeArrow)
      setOutflowDifferenceArrow(response.outflowDifferenceArrow)
      setOutflowPercentageArrow(response.outflowPercentageChangeArrow)
      setIsLoading(false)
    }

    const handlesTotalCash = (response) => {
      setTotalCash(response)
    }

    const handlesMonthlyRecords = (response) => {
      setData(response)
    }

    const handlesNewMonthlyRecord = (response) => {
      setData(response)
      toast.success("New monthly collection record.",{
        position: "top-right"
      })
    }

    socket.on("receive_total_cash", handlesTotalCash)
    socket.on("receive_collection_analytics", handlesCollectionAnalytics)
    socket.on("receive_collection_records", handlesMonthlyRecords)
    socket.on("receive_collection_records_notif", handlesNewMonthlyRecord)

    return () => {
      socket.off("receive_total_cash")
      socket.off("receive_collection_analytics")
      socket.off("receive_monthly_records")
      socket.off("receive_collection_records_notif")
    }

  }, [socket])

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

// Filter data based on search text
const filteredData = data.filter(row =>
  Object.values(row).some(value =>
    value.toString().toLowerCase().includes(searchText.toLowerCase())
  )
);

const handleRowClick = (row) => {
  navigate('/Dashboard/reviewViewCollection', { state: { rowData: row } });
};

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

//LOADER
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
    

        <div className="max-w-screen-2xl mx-auto flex flex-col ">
    <div className="">
      
      <div className="flex gap-4">
          {/* Sales Card */}
          <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-10 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Cash of the Company</p>
              <BsCashCoin className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(totalCash)}</p>
            </div>
          </div>
          {(userData.role === 'ADMIN')  && (
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-10 transition-transform transform hover:scale-105  hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Cash Deposit</p>
              <PiHandDeposit className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3 hover:cursor-pointer"  onClick={() => document.getElementById('deposit_modal').showModal()}>
            <FaRegPlusSquare className="text-green-600 text-2xl my-2" />
              <p className="text-3xl font-bold">Deposit</p>
            </div>
          </div>
          )}

          {(userData.role === 'ADMIN')  && (
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-10 transition-transform transform hover:scale-105  hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Cash Withdrawal</p>
              <PiHandWithdraw className="text-red-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3 hover:cursor-pointer"  onClick={() => document.getElementById('withdraw_modal').showModal()}>
            <FaRegMinusSquare className="text-red-600 text-2xl my-2" />
              <p className="text-3xl font-bold">Withdraw</p>
            </div>
          </div>
          )}
        </div>
          </div>

          <div className="">
      {/* Financial chart */}
      <div className="bg-white/75 shadow-xl rounded-lg p-6 mt-7">
      <h1 className="text-xl font-bold">Month of {currentMonth}</h1>
        <div className="flex gap-4">
            {/* Revenue Card */}
           <div className="bg-white/75 shadow-xl w-[350px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Sales</p>
              <PiCoinsFill className="text-yellow-500 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(salesAmount)}</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                {inflowPercentageArrow == "↑" ?  <IoIosArrowUp className="text-green-700" /> : <IoIosArrowDown className="text-red-700" /> } {inflowPercentage}
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
                {inflowDifferenceArrow == "↑" ? "+" : "-"} {formatCurrency(inflowDiff)}<span className="text-gray-500"> than past month</span>
              </p>
            </div>
          </div>

          {/* Spending Card */}
          <div className="bg-white shadow-xl w-[350px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Spent</p>
              <RiPassPendingLine className="text-red-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(spentAmount)}</p>
              <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
                {outflowPercentageArrow == "↑" ?  <IoIosArrowUp className="text-red-700" /> : <IoIosArrowDown className="text-red-700" /> } {outflowPercentage}
              </p>
            </div>
            <div className="my-3">
              <p className="text-red-700 font-semibold">
                {outflowDifferenceArrow == "↑" ? "+" : "-"} {formatCurrency(outflowDiff)} <span className="text-gray-500">than past month</span>
              </p>
            </div>
          </div>
            </div>

        {/* Bar Charts Section */}
        <div className="mt-10 mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Cash Flow</h3>
          <h4 className="text-md text-gray-500 mb-10">Shows the movement of cash in and out of the business during the selected period, offering insight into liquidity and operational efficiency.</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Inflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold text-gray-700 mb-5 text-center">Cash Inflow</h4>
              <AreaChart
            data={finalInflowsData}
            dataKey1="Amount"
            color1="rgb(74 222 128)"
            
          />
            </div>

            {/* Outflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold text-gray-700 mb-5 text-center">Cash Outflow</h4>
          <AreaChart
            data={finalOutflowsData}
            dataKey1="Amount"
            color1="rgb(248 113 113)"
            
          />
            </div>
          </div>
        </div>
      </div>
    </div>

        </div>
        <div className="max-w-screen-2xl mx-auto flex flex-col">
          <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 p-4 my-7">
                  <div className="mx-4">
                      <div className="overflow-x-auto w-full">
                          <DataTable
                              title="Collection Reports"
                              columns={columns}
                              data={filteredData}
                              pagination
                              defaultSortField="name"
                              highlightOnHover
                              pointerOnHover
                              onRowClicked={handleRowClick}
                              subHeader
                              subHeaderComponent={
                              <input
                                  type="text"
                                  placeholder="Search..."
                                  value={searchText}
                                  onChange={handleSearch}
                                  className="mb-2 p-2 border border-gray-400 rounded-lg"
                              />
                              }
                          />
                      </div>
                  </div>
              </div>
        </div>

        <dialog id="withdraw_modal" className="modal">
          <div className="modal-box">
            <h3 className="flex items-center justify-center font-bold text-lg">Enter Amount to Withdraw</h3>
            <div className="w-full mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="withdrawal">Amount</label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number" 
                placeholder="PHP" 
                required
                id="withdrawal"
              />
            </div>

            <div className="flex items-center justify-end mt-3">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                onClick={() => {
                  const amountInput = document.getElementById('withdrawal');
                  if (amountInput.checkValidity()) {
                    // Open the confirm modal if the input is valid
                    document.getElementById('confirm_withdraw_modal').showModal();
                  } else {
                    // Show validation error if input is invalid
                    amountInput.reportValidity();
                  }
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

<dialog id="confirm_withdraw_modal" className="modal">
  <div className="modal-box">
    <form className="space-y-4">
      <div>
        <h3 className="font-bold text-lg text-center">Enter Password to Confirm Withdrawal</h3>
        <label className="block text-gray-600 font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800">
        Confirm
      </button>
    </form>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog id="deposit_modal" className="modal">
          <div className="modal-box">
            <h3 className="flex items-center justify-center font-bold text-lg">Enter Amount to Deposit</h3>
            <div className="w-full mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deposit">Amount</label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number" 
                placeholder="PHP" 
                required
                id="deposit"
              />
            </div>

            <div className="flex items-center justify-end mt-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                onClick={() => {
                  const amountInput = document.getElementById('deposit');
                  if (amountInput.checkValidity()) {
                    // Open the confirm modal if the input is valid
                    document.getElementById('confirm_deposit_modal').showModal();
                  } else {
                    // Show validation error if input is invalid
                    amountInput.reportValidity();
                  }
                }}
              >
                Deposit
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog id="confirm_deposit_modal" className="modal">
  <div className="modal-box">
    <form className="space-y-4">
      <div>
        <h3 className="font-bold text-lg text-center">Enter Password to Confirm Deposit</h3>
        <label className="block text-gray-600 font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800">
        Confirm
      </button>
    </form>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>


    </>
  )
}

export default viewCollection
