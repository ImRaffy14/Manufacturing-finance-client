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
    const [inflowTransactionData, setInflowTransactionData] = useState([])
    const [outflowTransactionData, setOutflowTransactionData] = useState([])
    
  
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

      socket.emit('get_possible_outflow_anomaly', {msg: 'get possible anomaly'})
      socket.emit('get_possible_inflow_anomaly', {msg: 'get possible anomaly'})
      
      const handlePossibleOutflowAnomaly = (response) => {
        console.log(response)
      }

      const handlePossibleInflowAnomaly = (response) => {
        console.log(response)
      }

      socket.on('receive_possible_outflow_anomaly', handlePossibleOutflowAnomaly)
      socket.on('receive_possible_inflow_anomaly', handlePossibleInflowAnomaly)

      return () => {
        socket.off('receive_possible_outflow_anomaly')
        socket.off('receive_possible_inflow_anomaly')
      }

    },[socket])

    const handleFlagTransaction = (transactionId) => {
      console.log(`Flagged transaction: ${transactionId}`);
  };

  const handleBlockUser = (userId) => {
    console.log(`Blocked User: ${userId}`);
};

  const handleReload = () => {
    setInflowSearchText(""); 
    console.log("Data reloaded"); 
};



    const columns = [
      { name: 'Transaction ID', selector: row => row.transactionId },
      { name: 'Transaction Date', selector: row => row.transactionDate },
      { name: 'Amount', selector: row => formatCurrency(row.amount) },
      { name: 'Transaction Type', selector: row => row.transactionType },
      { 
        name: 'Anomaly Score', 
        selector: row => (row.anomalyScore !== undefined && row.anomalyScore !== null) ? row.anomalyScore.toFixed(2) : "0.00"
    },
      {
          name: 'Flag', 
          cell: (row) => (
              <button 
                  onClick={() => handleFlagTransaction(row.transactionId)}
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
                className="btn btn-outline btn-error mt-2 mb-2"
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
  { name: 'ID', selector: row => row._id },
  { name: 'Request ID', selector: row => row.requestId },
  { name: 'Category', selector: row => row.category },
  { name: 'Department', selector: row => row.department },
  { name: 'Total Request', selector: row => row.totalRequest },
  { name: 'Budget Request ID', selector: row => row.budgetReqId },
];

const purchaseOrderDuplicationColumns = [
  { name: 'ID', selector: row => row._id },
  { name: 'Order Number', selector: row => row.orderNumber },
  { name: 'Customer Name', selector: row => row.customerName },
  { name: 'Total Amount', selector: row => row.totalAmount },
  { name: 'PO ID', selector: row => row.poId },
];

const inflowDuplicationColumns = [
  { name: 'ID', selector: row => row._id },
  { name: 'Auditor ID', selector: row => row.auditorId },
  { name: 'Auditor', selector: row => row.auditor },
  { name: 'Invoice ID', selector: row => row.invoiceId },
  { name: 'Total Amount', selector: row => row.totalAmount },
  { name: 'Inflow ID', selector: row => row.inflowId },
];

const outflowDuplicationColumns = [
  { name: 'ID', selector: row => row._id },
  { name: 'Approver ID', selector: row => row.approverId },
  { name: 'Approver', selector: row => row.approver },
  { name: 'Payable ID', selector: row => row.payableId },
  { name: 'Total Amount', selector: row => row.totalAmount },
  { name: 'Outflow ID', selector: row => row.outflowId },
];

const unusualActivityColumns = [
  { name: 'ID', selector: row => row._id },
  { name: 'username', selector: row => row.username },
  { name: 'Role', selector: row => row.role },
  { name: 'IP Address', selector: row => row.ipAddress },
];

    const unusualActivityData = [
      {
          _id: 'UA001',
          username: '2024-02-08 02:30 AM',
          role: '1232131',
          ipAddress: 'Cash Withdrawal',
      },
      {
        _id: '31232131',
        username: '2024-02-08 02:30 AM',
        role: '1232131',
        ipAddress: 'Cash Withdrawal',
    },
    {
      _id: '23112312',
      username: '2024-02-08 02:30 AM',
      role: '231131',
      ipAddress: 'Cash Withdrawal',
  },
    ];

    const budgetDuplicationData = [
      {
          _id: 'UA001',
          requestId: '2024-02-08 02:30 AM',
          department: 750000,
          category: 'Cash Withdrawal',
          anomtotalRequestalyScore: 0.97, 
          budgetReqId: 0.97, 
          totalRequest: 0.97, 
      },
      {
        _id: '32',
        requestId: '2024-02-08 02:30 AM',
        department: 750000,
        category: 'Cash Withdrawal',
        anomtotalRequestalyScore: 0.97, 
        budgetReqId: 0.97, 
        totalRequest: 0.97, 
    },
    {
      _id: '123',
      requestId: '2024-02-08 02:30 AM',
      department: 750000,
      category: 'Cash Withdrawal',
      anomtotalRequestalyScore: 0.97, 
      budgetReqId: 0.97, 
      totalRequest: 0.97, 
  },
    ];

    const purchaseOrderDuplicationData = [
      {
          _id: 'UA001',
          orderNumber: '2024-02-08 02:30 AM',
          customerName: '750000',
          totalAmount: 'Cash Withdrawal',
          poId: 0.97, 
      },
      {
        _id: '32',
        orderNumber: '2024-02-08 02:30 AM',
        customerName: 750000,
        totalAmount: 'Cash Withdrawal',
        poId: 0.97, 
    },
    {
      _id: '3213',
      orderNumber: '2024-02-08 02:30 AM',
      customerName: 750000,
      totalAmount: 'Cash Withdrawal',
      poId: 0.97, 
  },
    ];


    const inflowDuplicationData = [
      {
          _id: 'UA001',
          auditorId: '2024-02-08 02:30 AM',
          auditor: '750000',
          invoiceId: 'Cash Withdrawal',
          totalAmount: 0.97, 
          inflowId: '1231321'
      },
      {
        _id: '32',
        auditorId: '2024-02-08 02:30 AM',
        auditor: '750000',
        invoiceId: 'Cash Withdrawal',
        totalAmount: 0.97, 
        inflowId: '1231321'
    },
    {
      _id: '12313',
      auditorId: '2024-02-08 02:30 AM',
      auditor: '750000',
      invoiceId: 'Cash Withdrawal',
      totalAmount: 0.97, 
      inflowId: '1231321'
  },
    ];

    const outflowDupulicationData = [
      {
          _id: 'UA001',
          approverId: '2024-02-08 02:30 AM',
          approver: '750000',
          payableId: 'Cash Withdrawal',
          totalAmount: 0.97, 
          outflowId: '1231321'
      },
      {
        _id: '321321',
        approverId: '2024-02-08 02:30 AM',
        approver: '750000',
        payableId: 'Cash Withdrawal',
        totalAmount: 0.97, 
       outflowId: '1231321'
    },
    {
      _id: '3213211',
      approverId: '2024-02-08 02:30 AM',
      approver: '750000',
      payableId: 'Cash Withdrawal',
      totalAmount: 0.97, 
      outflowId: '1231321'
  },
    ];




    const failedLoginAttemptsData = [
      {
          _id: '12313231312qwe',
         userId: '12321313123',
         username: 'Angelo',
         ipAddress : '123.123.123',
         attempts: 4,
         attemptDate: '12/12/12',
      },
      {
        _id: '32213',
       userId: '12321313123',
       username: 'Angelo',
       ipAddress : '123.123.123',
       attempts: 4,
       attemptDate: '12/12/12',
    },
    {
      _id: '222222',
     userId: '12321313123',
     username: 'Angelo',
     ipAddress : '123.123.123',
     attempts: 4,
     attemptDate: '12/12/12',
  },
    ];


    const combinedData = [...inflowTransactionData, ...outflowTransactionData];
    const totalFlaggedAnomalies = combinedData.filter(row => row.anomalyScore > 0.8).length;
    const totalAnomaliesResolved = 1;
    const totalOnInvestigation = totalFlaggedAnomalies - totalAnomaliesResolved;

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
      <DataTable
    title="Possible Anomaly Inflow Transactions"
    columns={columns}
    data={filteredInflowTransactionData}
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
                onClick={handleReload} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
    }
    customStyles={customStyles}
/>
      </div>
      
      {/* Right Column - Outflow Transactions */}
      <div>
        <DataTable 
          title="Possible Anomaly Outflow Transactions"
          columns={columns}
          data={filteredOutflowTransactionData}
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
                onClick={handleReload} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
          }
          customStyles={customStyles}
        />
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
      <DataTable
    title="Budget Request Duplication"
    columns={budgetDuplicationColumns}
    data={filteredBudgetDuplicationData}
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
      <button 
          onClick={handleReload} 
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
          title="Reload"
      >
          <FaRedo className="text-gray-700" />
      </button>
  </div>
       
    }
    customStyles={customStyles}
/>
      </div>
      
      {/* Right Column - puurchase order duplication */}
      <div>
        <DataTable 
          title="Purchase Order Duplication"
          columns={purchaseOrderDuplicationColumns}
          data={filteredPurchaseOrderDuplicationData}
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
            <button 
                onClick={handleReload} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
          }
          customStyles={customStyles}
        />
      </div>

          {/*INFFLOW DUPLICATION */}
      <div>
        <DataTable 
          title="Inflow Transaction Duplication"
          columns={inflowDuplicationColumns}
          data={filteredInflowDuplicationData}
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
            <button 
                onClick={handleReload} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
          }
          customStyles={customStyles}
        />
      </div>

        {/*OUTFLOW DUPLICATION */}
        <div>
        <DataTable 
          title="Outflow Transaction Duplication"
          columns={outflowDuplicationColumns}
          data={filteredOutflowDuplicationData}
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
            <button 
                onClick={handleReload} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
          }
          customStyles={customStyles}
        />
      </div>
    </div>
  </div>
</div>



            <div className="mt-5">
                <div className="bg-white/75 shadow-xl rounded-lg p-6">
                <DataTable
              title="Unusual Activity"
              columns={unusualActivityColumns}
              data={filteredUnusualActivityData}
              pagination
              highlightOnHover
              pointerOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={unusualActivitySearchText}
                  onChange={handleUnusualActivitySearch}
                  className="mb-2 p-2 border border-gray-400 rounded-lg"
                />
              }
            />
            </div>
            </div>


            <div className="mt-5 mb-5 ">
                <div className="bg-white/75 shadow-xl rounded-lg p-6">
                <DataTable
              title="Failed Login Attempts"
              columns={failedAttemptsColumns}
              data={filteredFailedLoginAttemptsData}
              pagination
              highlightOnHover
              pointerOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={failedLoginAttemptsSearchText}
                  onChange={handleFailedLoginAttemptsSearch}
                  className="mb-2 p-2 border border-gray-400 rounded-lg"
                />
              }
            />
            </div>
            </div>
        </div>
    );
}

export default AnomalyDetection;
