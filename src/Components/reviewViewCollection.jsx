import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
import { RiPassPendingLine } from "react-icons/ri";
import { FaIndustry } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";  
import { PiHandWithdraw } from "react-icons/pi";
import { FaRegPlusSquare } from "react-icons/fa";
import AreaChart from '../Components/ReCharts/AreaChart';
import { PiCoinsFill } from "react-icons/pi";
import { MdAutoGraph } from "react-icons/md";
import { useSocket } from "../context/SocketContext"


function reviewViewCollection() {
    const location = useLocation(); // Get the location object
    const { rowData } = location.state || {}; // Extract rowData from location.state
    if (!rowData) {
      return <p>No data available.</p>;
    }
    const socket = useSocket()
    const [data, setData] = useState([])
    const [cashAmount, setCashAmount] = useState(0);
    const [salesAmount, setSalesAmount] = useState(0);
    const [spentAmount, setSpent] = useState(0);
    const [netIncome, setNetIncome] = useState(0);
    const [response, setResponse] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const formatCurrency = (value) => {
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      };
      const inflowColumns = [
        { name: 'ID', selector: row => row._id },
        { name: 'Date', selector: row => row.date },
        { name: 'Total Cash Inflow', selector: row => formatCurrency(row.totalInflows) },
        { name: 'Net Income', selector: row => formatCurrency(row.netIncome)},
      ];
    
      const outflowColumns = [
        { name: 'ID', selector: row => row._id },
        { name: 'Date', selector: row => row.date },
        { name: 'Total Cash Outflow', selector: row => formatCurrency(row.totalOutflows) },
        { name: 'Net Income', selector: row => formatCurrency(row.netIncome)},
      ];
    
      const inflowData = [
        { _id: 1, date: '2022-01-01', totalInflows: 0, netIncome: 0},
      ]

      const outflowData = [
        { _id: 1, date: '2022-01-01', totalOutflows: 0, netIncome: 0},
      ]
      const handleSearch = (event) => {
        setSearchText(event.target.value);
      };
    
    // Filter data based on search text
    const filteredInflowData = inflowData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    
    const filteredOutflowData = outflowData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    const handleRowClick = (row) => {
      navigate('/Dashboard/reviewViewCollection', { state: { rowData: row } });
    };
    

    //FETCHING DATA
    useEffect(() => {
      socket.emit("get_month_collection", rowData._id)
    }, [])

    useEffect(() => {
      if(!socket) return;
      
      const handlesMonthCollection = (response) => {
        setResponse(response)
        setIsLoading(false)
        console.log(response)
      }

      socket.on("receive_month_collection", handlesMonthCollection)

      return () => {
        socket.off("receive_month_collection")
      }
    }, [socket])


    //INFLOWS ANALYTICS
    const inflowsData = response.inflows && response.inflows.length > 0 
    ? response.inflows.map((inflow) => ({
        _id: `week ${inflow._id}`,
        Amount: inflow.totalInflowAmount
      })) 
    : [];
  
  while (inflowsData.length < 4) {
    const lastWeekNumber = inflowsData.length > 0
      ? parseInt(inflowsData[inflowsData.length - 1]._id.replace('week ', ''), 10)
      : 0;
  
    inflowsData.push({
      _id: `week ${lastWeekNumber + 1}`,
      Amount: 0
    });
  }
  
  inflowsData.sort((a, b) => {
    const weekA = parseInt(a._id.replace('week ', ''), 10);
    const weekB = parseInt(b._id.replace('week ', ''), 10);
    return weekA - weekB;
  });
  

    // OUTFLOWS ANALYTICS
  let outflowsData = response.outflows && response.outflows.length > 0 
    ? response.outflows.map((outflow) => ({
      _id: `week ${outflow._id}`,
      Amount: outflow.totalOutflowAmount
    })) 
  : [];

  // Fill missing weeks for outflows
  while (outflowsData.length < 4) {
    const lastWeekNumber = outflowsData.length > 0
      ? parseInt(outflowsData[outflowsData.length - 1]._id.replace('week ', ''), 10)
      : 0;

    outflowsData.push({
      _id: `week ${lastWeekNumber + 1}`,
      Amount: 0
    });
  }

  // Sort by week number in ascending order
  outflowsData.sort((a, b) => {
    const weekA = parseInt(a._id.replace('week ', ''), 10);
    const weekB = parseInt(b._id.replace('week ', ''), 10);
    return weekA - weekB;
  });



    //GET MONTH NAME AND YEAR FORMAT
    const formatDateString = (dateString) => {
      if (!dateString) return 'Unknown Date'
      const parts = dateString.split('/')
      if (parts.length !== 3) return 'Invalid Date Format'
      const month = parseInt(parts[0], 10)
      const year = parts[2]
    
      const monthNames = [
        'January', 'February', 'March', 'April', 
        'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'
      ]
    
      return `${monthNames[month - 1]} ${year}`
    };
    

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
      <h2 className="text-xl font-bold mb-4">Month of {formatDateString(response.date)}</h2>
        <div className="flex gap-4">
            {/* Net Income Card */}
           <div className="bg-white/75 shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Net Income</p>
              <MdAutoGraph className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(response.netIncome)}</p>
            </div>
            <div className="my-3">
            </div>
          </div>
            {/* Revenue Card */}
           <div className="bg-white/75 shadow-xl w-[350px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Sales</p>
              <PiCoinsFill className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(response.totalInflows)}</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
              {response.inflowDifferenceArrow == "↑" ?  <IoIosArrowUp className="text-green-700" /> : <IoIosArrowDown className="text-red-700" /> } {response.inflowPercentageChange}
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
                {response.inflowPercentageChangeArrow == "↑" ? "+" : "-"} {formatCurrency(response.inflowDifference)}<span className="text-gray-500"> than past month</span>
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
              <p className="text-3xl font-bold">{formatCurrency(response.totalOutflows)}</p>
              <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
              {response.outflowDifferenceArrow == "↑" ?  <IoIosArrowUp className="text-red-700" /> : <IoIosArrowDown className="text-red-700" /> } {response.outflowPercentageChange}
              </p>
            </div>
            <div className="my-3">
              <p className="text-red-700 font-semibold">
                {response.outflowPercentageChangeArrow == "↑" ? "+" : "-"} {formatCurrency(response.outflowDifference)} <span className="text-gray-500">than past month</span>
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
              <h4 className="text-lg font-semibold text-gray-700 mb-5 text-center">Cash Inflow</h4>
              <AreaChart
            data={inflowsData}
            dataKey1="Amount"
            color1="rgb(74 222 128)"
            
          />
            </div>

            {/* Outflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold text-gray-700 mb-5 text-center">Cash Outflow</h4>
          <AreaChart
            data={outflowsData}
            dataKey1="Amount"
            color1="rgb(248 113 113)"
            
          />
            </div>
          </div>
        </div>
      </div>
      <div className="items-center justify-center bg-white rounded-lg shadow-xl mt-7 mb-7 border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Cash Inflow Records"
                            columns={inflowColumns}
                            data={filteredInflowData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handleRowClick}// Add onRowClicked handler
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

            <div className="items-center justify-center bg-white rounded-lg shadow-xl mt-7 mb-7 border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Cash Outflow Records"
                            columns={outflowColumns}
                            data={filteredOutflowData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handleRowClick}// Add onRowClicked handler
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
</>
  )
}

export default reviewViewCollection
