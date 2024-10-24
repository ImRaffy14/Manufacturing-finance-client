import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

function financialReports({ userData }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };
  const columns = [
    { name: 'Financial Report ID', selector: row => row._id, },
    { name: 'Date', selector: row => row.date,  },
    { name: 'Total Liabilities and Equity', selector: row => row.liabilitiesAndEquity, },
    { name: 'Net Income', selector: row => row.netIncome,},
    { name: 'Ending Balance', selector: row => row.endingBalance,},
  ];

  const data = [
    { _id: 1, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
    { _id: 2, date: '2022-01-01', liabilitiesAndEquity: 2222, netIncome: 22222, endingBalance: 22222 },
    { _id: 3, date: '2022-01-01', liabilitiesAndEquity: 22222, netIncome: 22222, endingBalance: 22222 },
  ]

    //Handles Search from datatables
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
    navigate('/Dashboard/viewFinancialReports', { state: { rowData: row } });
};
  return (
    <>
    <div className="max-w-screen-2xl mx-auto mt-[20px]">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10">
          <div className="mx-4">
              <div className="overflow-x-auto w-full">
                  <DataTable
                      title="Financial Reports"
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
    </>
  )
}

export default financialReports
