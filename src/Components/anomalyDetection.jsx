import React, { useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaSearch } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import DataTable from 'react-data-table-component';

function AnomalyDetection() {
    const [inflowSearchText, setInflowSearchText] = useState('');
    const [outflowSearchText, setOutflowSearchText] = useState('');
    const [unusualActivitySearchText, setUnusualActivitySearchText] = useState('');
    const [dataDuplicationSearchText, setDataDuplicationSearchText] = useState('');
    const [failedLoginAttemptsSearchText, setFailedLoginAttemptsSearchText] = useState('');
   

    const formatCurrency = (value) => {
        if (value === undefined || value === null) {
            return `₱0.00`;
        }
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const handleFlagTransaction = (transactionId) => {
      console.log(`Flagged transaction: ${transactionId}`);
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
      { name: 'Anomaly Score', selector: row => row.anomalyScore.toFixed(2) },
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

    const unusualActivityData = [
      {
          transactionId: 'UA001',
          transactionDate: '2024-02-08 02:30 AM',
          amount: 750000,
          transactionType: 'Cash Withdrawal',
          anomalyScore: 0.97, 
      },
      {
          transactionId: 'UA002',
          transactionDate: '2024-02-08 03:45 AM',
          amount: 250000,
          transactionType: 'Online Purchase',
          anomalyScore: 0.92, 
      },
      {
          transactionId: 'UA003',
          transactionDate: '2024-02-07 11:15 PM',
          amount: 98000,
          transactionType: 'Luxury Store Purchase',
          anomalyScore: 0.85,
      },
    ];

    const dataDuplicationData = [
      {
          transactionId: 'QWEQWE',
          transactionDate: '2024-02-08 02:30 AM',
          amount: 750000,
          transactionType: 'Cash Withdrawal',
          anomalyScore: 0.97, 
      },
      {
        transactionId: 'QWEQWE',
        transactionDate: '2024-02-08 02:30 AM',
        amount: 750000,
        transactionType: 'Cash Withdrawal',
        anomalyScore: 0.97, 
    },
    {
      transactionId: 'QWEQWE',
      transactionDate: '2024-02-08 02:30 AM',
      amount: 750000,
      transactionType: 'Cash Withdrawal',
      anomalyScore: 0.97, 
  },
    ];

    const failedLoginAttemptsData = [
      {
          transactionId: 'QWEQWE',
          transactionDate: '2024-02-08 02:30 AM',
          amount: 750000,
          transactionType: 'Cash Withdrawal',
          anomalyScore: 0.97, 
      },
      {
        transactionId: 'QWEQWE',
        transactionDate: '2024-02-08 02:30 AM',
        amount: 750000,
        transactionType: 'Cash Withdrawal',
        anomalyScore: 0.97, 
    },
    {
      transactionId: 'QWEQWE',
      transactionDate: '2024-02-08 02:30 AM',
      amount: 750000,
      transactionType: 'Cash Withdrawal',
      anomalyScore: 0.97, 
  },
    ];


    const inflowTransactionData = [
        { transactionId: 'TX001', transactionDate: '2024-11-10', amount: 50000, transactionType: 'Purchase', anomalyScore: 0.95 },
        { transactionId: 'TX002', transactionDate: '2024-11-11', amount: 1500, transactionType: 'Refund', anomalyScore: 0.10 },
        { transactionId: 'TX003', transactionDate: '2024-11-12', amount: 120000, transactionType: 'Purchase', anomalyScore: 0.85 },
    ];

    const outflowTransactionData = [
        { transactionId: '123', transactionDate: '2024-11-10', amount: 50000, transactionType: 'Purchase', anomalyScore: 0.95 },
        { transactionId: '222', transactionDate: '2024-11-11', amount: 1500, transactionType: 'Refund', anomalyScore: 0.10 },
        { transactionId: '333', transactionDate: '2024-11-12', amount: 120000, transactionType: 'Purchase', anomalyScore: 0.85 },
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

    const filteredUnusualActivityData = unusualActivityData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(unusualActivitySearchText.toLowerCase())
      )
  );
    const filteredDataDuplicationData = dataDuplicationData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(dataDuplicationSearchText.toLowerCase())
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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



            <div className="mt-5">
                <div className="bg-white/75 shadow-xl rounded-lg p-6">
                <DataTable
              title="Unusual Activity"
              columns={columns}
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

            <div className="mt-5">
                <div className="bg-white/75 shadow-xl rounded-lg p-6">
                <DataTable
              title="Data Duplication"
              columns={columns}
              data={filteredDataDuplicationData}
              pagination
              highlightOnHover
              pointerOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={dataDuplicationSearchText}
                  onChange={handleDataDuplicationSearch}
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
              columns={columns}
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
