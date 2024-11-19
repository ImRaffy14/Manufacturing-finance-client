import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useSocket } from "../context/SocketContext";

function FinancialReports({ userData }) {
  const navigate = useNavigate();
  const socket = useSocket()

  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([])
  
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const dateFormat = (value) => {
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',  
    });
    return formattedDate
  }

  const columns = [
    { name: 'Financial Report ID', selector: row => row._id, },
    { name: 'Date', selector: row => dateFormat(row.date),  },
    { name: 'Total Liabilities and Equity', selector: row => formatCurrency(row.totalLiabilitiesAndEquity), },
    { name: 'Net Income', selector: row => formatCurrency(row.netIncome), },
    { name: 'Net Cash Flow', selector: row => formatCurrency(row.netCashFlow), },
  ];



  useEffect(() => {
    if(!socket) return;

    socket.emit('get_financial_report', 'get financial reports')

    const handleFinancialReport = (response) => {
      setData(response)
    }

    socket.on('receive_financial_report', handleFinancialReport)

    return () => {
      socket.off('receive_financial_report')
    }
  },[socket])

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
