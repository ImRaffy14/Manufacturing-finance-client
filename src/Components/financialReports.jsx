import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
const SummaryStatistics = ({ data, formatCurrency }) => {
  const totalLiabilities = data.reduce((acc, item) => acc + item.liabilitiesAndEquity, 0);
  const totalNetIncome = data.reduce((acc, item) => acc + item.netIncome, 0);
  const totalEndingBalance = data.reduce((acc, item) => acc + item.endingBalance, 0);
  return (
    <div className="flex justify-between bg-white p-6 rounded-lg mb-6 shadow-md">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-gray-800">Total Liabilities</span>
        <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalLiabilities)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-gray-800">Total Net Income</span>
        <span className="text-2xl font-bold text-green-600">{formatCurrency(totalNetIncome)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-gray-800">Total Ending Balance</span>
        <span className="text-2xl font-bold text-purple-600">{formatCurrency(totalEndingBalance)}</span>
      </div>
    </div>
  );
};

function FinancialReports({ userData }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Financial Report ID', selector: row => row._id, },
    { name: 'Date', selector: row => row.date,  },
    { name: 'Total Liabilities and Equity', selector: row => row.liabilitiesAndEquity, },
    { name: 'Net Income', selector: row => row.netIncome, },
    { name: 'Ending Balance', selector: row => row.endingBalance, },
  ];

  const data = [
    { _id: 1, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
    { _id: 2, date: '2022-01-01', liabilitiesAndEquity: 2222, netIncome: 22222, endingBalance: 22222 },
    { _id: 3, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    navigate('/Dashboard/viewFinancialReports', { state: { rowData: row } });
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-[20px]">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10 p-6">
          <SummaryStatistics data={filteredData} formatCurrency={formatCurrency} />
          <div className="overflow-x-auto w-full">
            <DataTable
              title="Financial Reports"
              columns={columns}
              data={filteredData}
              pagination
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
    </>
  );
}

export default FinancialReports;
