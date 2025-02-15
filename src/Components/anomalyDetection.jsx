import React, { useEffect, useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaSearch } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import DataTable from 'react-data-table-component';
import { useSocket } from "../context/SocketContext"

function AnomalyDetection() {
    const [inflowSearchText, setInflowSearchText] = useState('');
    const [outflowSearchText, setOutflowSearchText] = useState('');
    const [unusualActivitySearchText, setUnusualActivitySearchText] = useState('');
    const [dataDuplicationSearchText, setDataDuplicationSearchText] = useState('');
    const [budgetDuplicationSearchText, setBudgetDuplicationSearchText] = useState('');
    const [purchaseOrderDuplicationSearchText, setPurchaseOrderDuplicationSearchText] = useState('');
    const [inflowDuplicationSearchText, setInflowDuplicationSearchText] = useState('');
    const [outflowDuplicationSearchText, setOutflowDuplicationSearchText] = useState('');
    const [failedLoginAttemptsSearchText, setFailedLoginAttemptsSearchText] = useState('');
    const [flaggedAnomalySearchText, setFlaggedAnomalySearchText] = useState ('');
    const [selectedBudgetRow, setSelectedBudgetRow] = useState(null);
    const [selectedPurchaseRow, setSelectedPurchaseRow] = useState(null);
    const [selectedInflowRow, setSelectedInflowRow] = useState(null);
    const [selectedOutflowRow, setSelectedOutflowRow] = useState(null);
    const [selectedInflowTransaction, setSelectedInflowTransaction] = useState(null);
    const [selectedOutflowTransaction, setSelectedOutflowTransaction] = useState(null);
    const [selectedUnusualActivity, setSelectedUnusualActivity] = useState(null);
    const [selectedFailedLoginAttempt, setSelectedFailedLoginAttempt] = useState(null);
    const [selectedFlaggedAnomaly, setSelectedFlaggedAnomaly] = useState(null);
  

    // TABLE DATA
    const [inflowTransactionData, setInflowTransactionData] = useState([]);
    const [outflowTransactionData, setOutflowTransactionData] = useState([]);
    const [budgetDuplicationData, setBudgetDuplicationData] = useState([]);
    const [purchaseOrderDuplicationData, setPurchaseOrderDuplicationData] = useState([])
    const [inflowDuplicationData, setInflowDuplicationData] = useState([])
    const [outflowDupulicationData, setOutflowDuplicationData] = useState([])
    const [unusualActivityData, setUnusualActivityData] = useState([])
    const [failedLoginAttemptsData, setFailedLoginAttemptsData] = useState([])

    // FOR LOADERS
    const [isLoadingPOT, setIsLoadingPOT] = useState(true);
    const [isLoadingPIT, setIsLoadingPIT] = useState(true);
    const [isLoadingBRD, setIsLoadingBRD] = useState(true)
    const [isLoadingPOD, setIsLoadingPOD] = useState(true)
    const [isLoadingID, setIsLoadingID] = useState(true)
    const [isLoadingOD, setIsLoadingOD] = useState(true)
    const [isLoadingSL, setIsLoadingSL] = useState(true)
    const [isLoadingFLA, setIsLoadingFLA] = useState(true)
    

    const formatCurrency = (value) => {
        if (value === undefined || value === null) {
            return `₱0.00`;
        }
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    //SOCKET CONNECTION
    const socket = useSocket()

    // FETCH ANOMALY DATA
    useEffect(() => {
      if(!socket) return

      socket.emit('get_possible_outflow_anomaly')
      socket.emit('get_possible_inflow_anomaly')
      socket.emit('get_budget_req_duplication')
      socket.emit('get_po_duplication')
      socket.emit('get_inflow_duplication')
      socket.emit('get_outflow_duplication')
      socket.emit('get_suspicious_login')
      socket.emit('get_failed_attempt')
      
      // GET POSSIBLE OUTFLOW ANOMALY
      const handlePossibleOutflowAnomaly = (response) => {
        setOutflowTransactionData(response)
        setIsLoadingPOT(false)
      }

      // GET POSSIBLE INFLOW ANOMALY
      const handlePossibleInflowAnomaly = (response) => {
        setInflowTransactionData(response)
        setIsLoadingPIT(false)
      }

      // GET BUDGET REQUEST DUPLICATION
      const handleBudgetReqDuplication = async (response) => {
        const data = response.map((item) => ({
          requestId: item._id.requestId,
          department: item._id.department,
          category: item._id.category,
          totalRequest: item._id.totalRequest,
          count: item.count,
          budgetReqId: item.budgetReqId
        }))
        setBudgetDuplicationData(data)
        setIsLoadingBRD(false)
      }
      
      // GET PURCHASE ORDER DUPLICATION
      const handlePurchaseOrderDuplication = async (response) => {
        const data = response.map((item) => ({
          orderNumber: item._id.orderNumber,
          customerName: item._id.customerName,
          totalAmount: item._id.totalAmount,
          count: item.count,
          poId: item.poId
        }))
        setPurchaseOrderDuplicationData(data)
        setIsLoadingPOD(false)
      }

      // GET INFLOW TRANSACTION DUPLICATION
      const handleInflowDuplication = async (response) => {
        const data = response.map((item) => ({
          auditorId: item._id.auditorId,
          auditor: item._id.auditor,
          invoiceId: item._id.invoiceId,
          totalAmount: item._id.totalAmount,
          count: item.count,
          inflowId: item.inflowId
        }))
        setInflowDuplicationData(data)
        setIsLoadingID(false)
      }

      // GET OUTFLOW TRANSACTION DUPLICATION
      const handleOutflowDuplication = async (response) => {
        const data = response.map((item) => ({
          approverId: item._id.approverId,
          approver: item._id.approver,
          payableId: item._id.payableId,
          totalAmount: item._id.totalAmount,
          count: item.count,
          outflowId: item.outflowId
        }))
        setOutflowDuplicationData(data)
        setIsLoadingOD(false)
      }
      
      // GET SUSPICIOUS LOGIN
      const handleSuspiciousLogin = async  (response) => {
        const data = response.map((item) => ({
          userId: item._id.userId,
          username: item._id.username,
          role: item._id.role,
          count: item.count,
          ipAddress: item.ipAddress,
          deviceInfo: item.deviceInfo
        }))
        setUnusualActivityData(data)
        setIsLoadingSL(false)

      }

      // GET FAILED ATTEMPT LOGIN
      const handleFailedAttemptLogin = async (response) => {
        setFailedLoginAttemptsData(response)
        setIsLoadingFLA(false)
      }

      socket.on('receive_failed_attempt', handleFailedAttemptLogin)
      socket.on('receive_suspicious_login', handleSuspiciousLogin)
      socket.on('receive_outflow_duplication', handleOutflowDuplication)
      socket.on('receive_inflow_duplication', handleInflowDuplication)
      socket.on('receive_po_duplicaiton', handlePurchaseOrderDuplication)
      socket.on('receive_budget_req_duplication', handleBudgetReqDuplication)
      socket.on('receive_possible_outflow_anomaly', handlePossibleOutflowAnomaly)
      socket.on('receive_possible_inflow_anomaly', handlePossibleInflowAnomaly)

      return () => {
        socket.off('receive_possible_outflow_anomaly')
        socket.off('receive_possible_inflow_anomaly')
        socket.off('receive_po_duplicaiton')
        socket.off('receive_budget_req_duplication')
        socket.off('receive_inflow_duplication')
        socket.off('receive_suspicious_login')
        socket.off('receive_failed_attempt')
      }

    },[socket])

    const handleFlagTransaction = (transactionId) => {
      console.log(`Flagged transaction: ${transactionId}`);
  };

  const handleBlockUser = (userId) => {
    console.log(`Blocked User: ${userId}`);
};

  const handleReloadInflowP = () => {
    setInflowSearchText("");
    setIsLoadingPIT(true)
    socket.emit('get_possible_inflow_anomaly', {msg: 'get possible anomaly'})
  };

  const handleReloadOutflowP = () => {
    setInflowSearchText("");
    setIsLoadingPOT(true)
    socket.emit('get_possible_outflow_anomaly', {msg: 'get possible anomaly'})
  };


    const inflowTransactionsColumns = [
      { name: 'ID', selector: row => row.id },
      { name: 'Date & Time', selector: row => row.dateTime },
      { name: 'Auditor ID', selector: row => row.auditorId },
      { name: 'Auditor', selector: row => row.auditor },
      { name: 'P.O ID', selector: row => row.invoiceId },
      { name: 'Customer Name', selector: row => row.customerName },
      { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
      {
          name: 'Flag', 
          cell: (row) => (
              <button 
                  onClick={() => handleFlagTransaction(row.id)}
                  className="bg-white  text-red-500 p-2 rounded-md"
              >
                  <FaFlag />
              </button>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
      }
  ];

  const outflowTransactionsColumns = [
    { name: 'ID', selector: row => row.id },
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'Approver ID', selector: row => row.approverId },
    { name: 'Approver', selector: row => row.approver },
    { name: 'Payable ID', selector: row => row.payableId },
    { name: 'Category', selector: row => row.category },
    { name: 'Department', selector: row => row.department },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
    {
        name: 'Flag', 
        cell: (row) => (
            <button 
                onClick={() => handleFlagTransaction(row.id)}
                className="bg-white  text-red-500 p-2 rounded-md"
            >
                <FaFlag />
            </button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    }
];


  const failedAttemptsColumns = [
    { name: 'ID', selector: row => row._id },
    { name: 'User ID', selector: row => row.userId },
    { name: 'IP Address', selector: row => row.ipAddress },
    { name: 'Attempts', selector: row => row.attempts },
    { name: 'Date', selector: row => row.attemptDate },
    {
        name: 'Action', 
        cell: (row) => (
            <button 
                onClick={() => handleBlockUser(row.userId)}
                className="btn btn-outline hover:bg-white hover:text-black text-white mt-2 mb-2"
            >
                Block
            </button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    }
];

const budgetDuplicationColumns = [
  { name: 'Count', selector: row => row.count , width: '80px'},
  { name: 'Request ID', selector: row => row.requestId, width: '200px' },
  { name: 'Category', selector: row => row.category, width: '180px' },
  { name: 'Department', selector: row => row.department },
  { name: 'Budget Request ID', selector: row => (
    <ul>
      {row.budgetReqId.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ), width: '200px'},
  { name: 'Total Request', selector: row => formatCurrency(row.totalRequest) },
];

const purchaseOrderDuplicationColumns = [
  { name: 'Count', selector: row => row.count, width: '80px'},
  { name: 'Order Number', selector: row => row.orderNumber, width: '200px' },
  { name: 'Customer Name', selector: row => row.customerName, width: '150px' },
  { name: 'P.O ID', selector: row => ( 
    <ul>
      {row.poId.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>), width: '200px' 
  },
  { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
];

const inflowDuplicationColumns = [
  { name: 'Count', selector: row => row.count, width: '80px'},
  { name: 'Auditor ID', selector: row => row.auditorId, width: '200px' },
  { name: 'Auditor', selector: row => row.auditor, width: '100px' },
  { name: 'Invoice ID', selector: row => row.invoiceId, width: '200px' },
  { name: 'Inflow ID', selector: row => ( 
    <ul>
      {row.inflowId.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>), width: '200px' },
  { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount )},
];

const outflowDuplicationColumns = [
  { name: 'Count', selector: row => row.count, width: '80px'},
  { name: 'Approver ID', selector: row => row.approverId, width: '200px' },
  { name: 'Approver', selector: row => row.approver },
  { name: 'Payable ID', selector: row => row.payableId, width: '200px' },
  { name: 'Outflow ID', selector: row => ( 
    <ul>
      {row.outflowId.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>), width: '200px'
  },
  { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
];

const unusualActivityColumns = [
  { name: 'IP Address', selector: row => ( 
    <ul>
      {row.ipAddress.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>) },
  { name: 'Device Info', selector: row => ( 
  <ul>
    {row.deviceInfo.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>) },
  { name: 'Staff ID', selector: row => row.userId },
  { name: 'username', selector: row => row.username },
  { name: 'Role', selector: row => row.role },
];

const flaggedAnomalyColumns = [
  { name: 'ID', selector: row => row._id },
  { name: 'username', selector: row => row.username },
  { name: 'Role', selector: row => row.role },
];

const flaggedAnomalyData = [
  {
    username: 'John',
    role: 'admin',
    _id: '1',
  },
  {
    username: 'John',
    role: 'admin',
    _id: '2',
  },
  {
    username: 'John',
    role: 'admin',
    _id: '3',
  },
]


    const totalFlaggedAnomalies = 0;
    const totalAnomaliesResolved = 0;
    const totalOnInvestigation = 0;

    const handleInflowSearch = (event) => {
        setInflowSearchText(event.target.value);
    };

    const handleOutflowSearch = (event) => {
        setOutflowSearchText(event.target.value);
    };

    const handleBudgetDuplicationSearch = (event) => {
      setBudgetDuplicationSearchText(event.target.value);
  };

  const handlePurchaseOrderDuuplicationSearch = (event) => {
    setPurchaseOrderDuplicationSearchText(event.target.value);
};

const handleInflowDuplicationSearch = (event) => {
  setInflowDuplicationSearchText(event.target.value);
};

const handleOutflowDuplicationSearch = (event) => {
  setOutflowDuplicationSearchText(event.target.value);
};

    const handleUnusualActivitySearch = (event) => {
      setUnusualActivitySearchText(event.target.value);
  };

  const handleDataDuplicationSearch = (event) => {
    setDataDuplicationSearchText(event.target.value);
};
const handleFailedLoginAttemptsSearch = (event) => {
  setFailedLoginAttemptsSearchText(event.target.value);
};

const handleFlaggedAnomalySearch = (event) => {
  setFlaggedAnomalySearchText(event.target.value);
};

const handleBudgetRowClick = (row) => {
  setSelectedBudgetRow(row);
  document.getElementById("budget_modal").showModal();
};

const handlePurchaseRowClick = (row) => {
  setSelectedPurchaseRow(row);
  document.getElementById("purchase_modal").showModal();
};

const handleInflowRowClick = (row) => {
  setSelectedInflowRow(row);
  document.getElementById("inflow_modal").showModal();
};

const handleOutflowRowClick = (row) => {
  setSelectedOutflowRow(row);
  document.getElementById("outflow_modal").showModal();
};

const handleInflowTransactionClick = (row) => {
  setSelectedInflowTransaction(row);
  document.getElementById("inflow_transaction_modal").showModal();
};

const handleOutflowTransactionClick = (row) => {
  setSelectedOutflowTransaction(row);
  document.getElementById("outflow_transaction_modal").showModal();
};

const handleUnusualActivityClick = (row) => {
  setSelectedUnusualActivity(row);
  document.getElementById("unusual_activity_modal").showModal();
};

const handleFailedLoginAttemptClick = (row) => {
  setSelectedFailedLoginAttempt(row);
  document.getElementById("failed_login_attempt_modal").showModal();
};

const handleFlaggedAnomalyClick = (row) => {
  setSelectedFlaggedAnomaly(row);
  document.getElementById("flagged_anomaly_modal").showModal();
};

    const filteredInflowTransactionData = inflowTransactionData.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(inflowSearchText.toLowerCase())
        )
    );

    const filteredOutflowTransactionData = outflowTransactionData.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(outflowSearchText.toLowerCase())
        )
    );
    const filteredBudgetDuplicationData = budgetDuplicationData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(budgetDuplicationSearchText.toLowerCase())
      )
  );

  const filteredPurchaseOrderDuplicationData = purchaseOrderDuplicationData.filter(row =>
    Object.values(row).some(value =>
        value.toString().toLowerCase().includes(purchaseOrderDuplicationSearchText.toLowerCase())
    )
);

const filteredInflowDuplicationData = inflowDuplicationData.filter(row =>
  Object.values(row).some(value =>
      value.toString().toLowerCase().includes(purchaseOrderDuplicationSearchText.toLowerCase())
  )
);

const filteredOutflowDuplicationData = outflowDupulicationData.filter(row =>
  Object.values(row).some(value =>
      value.toString().toLowerCase().includes(outflowDuplicationSearchText.toLowerCase())
  )
);

    const filteredUnusualActivityData = unusualActivityData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(unusualActivitySearchText.toLowerCase())
      )
  );
    const filteredFailedLoginAttemptsData = failedLoginAttemptsData.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(failedLoginAttemptsSearchText.toLowerCase())
        )
    );

    const filteredFlaggedAnomalyData = flaggedAnomalyData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(flaggedAnomalySearchText.toLowerCase())
      )
  );
    const customStyles = {
      headRow: {
        style: {
          backgroundColor: 'rgba(0, 85, 170, 0.85)', 
          color: 'white',
        },
      },
      title: {
        style: {
          color: 'white',
          fontSize: '18px',
          padding: '10px',
          textAlign: 'center',
        },
      },
      rows: {
        style: {
          backgroundColor: 'rgba(200, 50, 50, 0.90)', 
          color: 'white', 
        },
      },
    };
    

    return (
        <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="bg-white/75 shadow-xl rounded-lg p-6">
                <h1 className="text-xl font-bold">Overview</h1>
                <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
                    <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3">
                        <p className="text-black font-semibold text-md">Total Flagged Anomalies</p>
                        <div className="flex gap-3 my-3">
                            <FaExclamationTriangle className="text-red-600 text-2xl my-2" />
                            <p className="text-4xl text-black font-bold">{totalFlaggedAnomalies}</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3">
                        <p className="text-black font-semibold text-md">Total Anomalies Resolved</p>
                        <div className="flex gap-3 my-3">
                            <FaCheckCircle className="text-green-600 text-2xl my-2" />
                            <p className="text-4xl text-black font-bold">{totalAnomaliesResolved}</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3">
                        <p className="text-black font-semibold text-md">Total On Investigation</p>
                        <div className="flex gap-3 my-3">
                            <FaSearch className="text-blue-600 text-2xl my-2" />
                            <p className="text-4xl text-black font-bold">{totalOnInvestigation}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
  <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Possible Anomaly Transactions</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Left Column - Inflow Transactions */}
      <div>
        {isLoadingPIT ? 
        <div className="flex justify-center items-center h-56">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        </div>       
        :
        <DataTable
        title="Possible Anomaly Inflow Transactions"
        columns={inflowTransactionsColumns}
        data={filteredInflowTransactionData}
        onRowClicked={handleInflowTransactionClick}
        pagination
        pointerOnHover
        subHeader
        subHeaderComponent={
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={inflowSearchText}
                    onChange={handleInflowSearch}
                    className="p-2 border border-gray-400 rounded-lg"
                />
                <button 
                    onClick={handleReloadInflowP} 
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                    title="Reload"
                >
                    <FaRedo className="text-gray-700" />
                </button>
            </div>
            }
            customStyles={customStyles}
          /> }
      </div>
      
      {/* Right Column - Outflow Transactions */}
      <div>
        {isLoadingPOT ?      
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div> 
          :
         <DataTable 
          title="Possible Anomaly Outflow Transactions"
          columns={outflowTransactionsColumns}
          data={filteredOutflowTransactionData}
          onRowClicked={handleOutflowTransactionClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={outflowSearchText}
                onChange={handleOutflowSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
            <button 
                onClick={handleReloadOutflowP} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
          }
          customStyles={customStyles}
        />}
      </div>
    </div>
  </div>
</div>

{/* Buudget Duplciation */}
<div className="mt-5">
  <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Data Duplication</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Left Column - Budget Duplication */}
      <div>
      {isLoadingBRD ? 
        <div className="flex justify-center items-center h-56">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        </div> 
        :
        <DataTable
        title="Budget Request Duplication"
        columns={budgetDuplicationColumns}
        data={filteredBudgetDuplicationData}
        onRowClicked={handleBudgetRowClick}
        pagination
        pointerOnHover
        subHeader
        subHeaderComponent={
        <div className="flex items-center gap-2">
        <input
            type="text"
            placeholder="Search..."
            value={budgetDuplicationSearchText}
            onChange={handleBudgetDuplicationSearch}
            className="p-2 border border-gray-400 rounded-lg"
        />
          </div>
              
            }
            customStyles={customStyles}
        />
      }
      </div>
      
      {/* Right Column - puurchase order duplication */}
      <div>
        {isLoadingPOD ? 
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div> 
          :
          <DataTable 
          title="Purchase Order Duplication"
          columns={purchaseOrderDuplicationColumns}
          data={filteredPurchaseOrderDuplicationData}
          onRowClicked={handlePurchaseRowClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={purchaseOrderDuplicationSearchText}
                onChange={handlePurchaseOrderDuuplicationSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />
        }
      </div>

          {/*INFFLOW DUPLICATION */}
      <div>
        {isLoadingID ? 
        <div className="flex justify-center items-center h-56">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        </div>  
        :     
        <DataTable 
          title="Inflow Transaction Duplication"
          columns={inflowDuplicationColumns}
          data={filteredInflowDuplicationData}
          onRowClicked={handleInflowRowClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={inflowDuplicationSearchText}
                onChange={handleInflowDuplicationSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />}
      </div>

        {/*OUTFLOW DUPLICATION */}
        <div>
          {isLoadingOD ?
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div>  
          :
          <DataTable 
          title="Outflow Transaction Duplication"
          columns={outflowDuplicationColumns}
          data={filteredOutflowDuplicationData}
          onRowClicked={handleOutflowRowClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={outflowDuplicationSearchText}
                onChange={handleOutflowDuplicationSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />
          }
      </div>
    </div>
  </div>
</div>


<div className="mt-5 mb-5">
  <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Login Anomalies</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Left Column - Suspicious Login */}
      <div>
        {isLoadingSL ? 
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div>  
          :
          <DataTable
          title="Suspicious Login"
          columns={unusualActivityColumns}
          data={filteredUnusualActivityData}
          onRowClicked={handleUnusualActivityClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
              <div className="flex items-center gap-2">
                  <input
                      type="text"
                      placeholder="Search..."
                      value={unusualActivitySearchText}
                      onChange={handleInflowSearch}
                      className="p-2 border border-gray-400 rounded-lg"
                  />
              </div>
          }
          customStyles={customStyles}
        />
        }
      </div>
      
      {/* Right Column - Failed Login attempts */}
      <div>
        {isLoadingFLA ?
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div>  
          :
          <DataTable 
          title="Failed Login Attempts"
          columns={failedAttemptsColumns}
          data={filteredFailedLoginAttemptsData}
          onRowClicked={handleFailedLoginAttemptClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={failedLoginAttemptsSearchText}
                onChange={handleOutflowSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />
        }
      </div>
    </div>
  </div>
</div>

      <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10">
          <div className="mx-4">
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Flaged Anomalies"
                columns={flaggedAnomalyColumns}
                data={filteredFlaggedAnomalyData}
                onRowClicked={handleFlaggedAnomalyClick}
                pagination
                defaultSortField="name"
                pointerOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search..."
                    value={flaggedAnomalySearchText}
                    onChange={handleFlaggedAnomalySearch}
                    className="mb-2 p-2 border border-gray-400 rounded-lg"
                  />
                }
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>


{/* MODALS */}
{selectedInflowTransaction && (
        <dialog id="inflow_transaction_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Inflow Transaction Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedInflowTransaction).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-outline btn-error">Flag Anomaly</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('inflow_transaction_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedOutflowTransaction && (
        <dialog id="outflow_transaction_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Outflow Transaction Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedOutflowTransaction).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-outline btn-error">Flag Anomaly</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('outflow_transaction_modal').close()}>Close</button>
          </form>
        </dialog>
      )}

{selectedBudgetRow && (
        <dialog id="budget_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Budget Request Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedBudgetRow).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary">Take Action</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('budget_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedPurchaseRow && (
        <dialog id="purchase_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Purchase Order Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedPurchaseRow).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary">Take Action</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('purchase_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedInflowRow && (
        <dialog id="inflow_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Inflow Transaction Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedInflowRow).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary">Take Action</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('inflow_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedOutflowRow && (
        <dialog id="outflow_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Outflow Transaction Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedOutflowRow).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary">Take Action</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('outflow_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
            {selectedUnusualActivity && (
        <dialog id="unusual_activity_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Suspicious Login Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedUnusualActivity).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
            <button className="btn btn-outline btn-error">Block User</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('unusual_activity_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedFailedLoginAttempt && (
        <dialog id="failed_login_attempt_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Failed Login Attempt Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedFailedLoginAttempt).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-outline btn-error">Block User</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('failed_login_attempt_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedFlaggedAnomaly && (
        <dialog id="flagged_anomaly_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Flagged Anomaly Preview</h1>
            <div className="space-y-4">
              {Object.entries(selectedFlaggedAnomaly).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <p className="font-medium"><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong></p>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary">Take Action</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('flagged_anomaly_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
        </div>
    );
}

export default AnomalyDetection;
