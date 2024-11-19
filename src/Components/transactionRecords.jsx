import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

function transactionRecords() {
  const navigate = useNavigate();
  const [inflowSearchText, setInflowSearchText] = useState('');
  const [outflowSearchText, setOutflowSearchText] = useState('');
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const inflowColumns = [
    { name: 'Financial Report ID', selector: row => row._id, },
    { name: 'Date', selector: row => row.date,  },
    { name: 'Total Liabilities and Equity', selector: row => row.liabilitiesAndEquity, },
    { name: 'Net Income', selector: row => row.netIncome, },
    { name: 'Ending Balance', selector: row => row.endingBalance, },
  ];
  const outflowColumns = [
    { name: 'Financial Report ID', selector: row => row._id, },
    { name: 'Date', selector: row => row.date,  },
    { name: 'Total Liabilities and Equity', selector: row => row.liabilitiesAndEquity, },
    { name: 'Net Income', selector: row => row.netIncome, },
    { name: 'Ending Balance', selector: row => row.endingBalance, },
  ];

  const inflowData = [
    { _id: 1, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
    { _id: 2, date: '2022-01-01', liabilitiesAndEquity: 2222, netIncome: 22222, endingBalance: 22222 },
    { _id: 3, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
  ];

  const outflowData = [
    { _id: 1, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
    { _id: 2, date: '2022-01-01', liabilitiesAndEquity: 2222, netIncome: 22222, endingBalance: 22222 },
    { _id: 3, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
  ];


  const handleInflowSearch = (event) => {
    setInflowSearchText(event.target.value);
  };
  const handleOutflowSearch = (event) => {
    setOutflowSearchText(event.target.value);
  };

  const filteredInflowData = inflowData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(inflowSearchText.toLowerCase())
    )
  );

  const filteredOutflowData = outflowData.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(outflowSearchText.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    navigate('/Dashboard/transactionRecords', { state: { rowData: row } });
  };

  return (
    <>
    <div className="max-w-screen-2xl mx-auto mt-[20px]">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10 p-6">
          <div className="overflow-x-auto w-full">
            <DataTable
              title="Inflow Transaction Records"
              columns={inflowColumns}
              data={filteredInflowData}
              pagination
              highlightOnHover
              pointerOnHover
              onRowClicked={handleRowClick}
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={inflowSearchText}
                  onChange={handleInflowSearch}
                  className="mb-2 p-2 border border-gray-400 rounded-lg"
                />
              }
            />
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto mt-[20px]">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10 p-6">
          <div className="overflow-x-auto w-full">
            <DataTable
              title="Outflow Transaction Records"
              columns={outflowColumns}
              data={filteredOutflowData}
              pagination
              highlightOnHover
              pointerOnHover
              onRowClicked={handleRowClick}
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={outflowSearchText}
                  onChange={handleOutflowSearch}
                  className="mb-2 p-2 border border-gray-400 rounded-lg"
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default transactionRecords
