import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useSocket } from "../context/SocketContext";

function transactionRecords() {
  const navigate = useNavigate();
  const socket = useSocket()
  const [inflowSearchText, setInflowSearchText] = useState('');
  const [outflowSearchText, setOutflowSearchText] = useState('');
  const [inflowData, setInflowData] = useState([])
  const [outflowData, setOutflowData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const inflowColumns = [
    { name: 'Transaction ID', selector: row => row._id },
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'Auditor ID', selector: row => row.auditorId },
    { name: 'Auditor', selector: row => row.auditor },
    { name: 'Invoice ID', selector: row => row.invoiceId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount)},
  ];
  const outflowColumns = [
    { name: 'Transaction ID', selector: row => row._id },
    { name: 'Date & Time', selector: row => row.dateTime, width: '200px' },
    { name: 'Approver', selector: row => row.approver, width: '100px' },
    { name: 'Approver ID', selector: row => row.approverId },
    { name: 'Payable ID', selector: row => row.payableId },
    { name: 'Category', selector: row => row.category },
    { name: 'Department', selector: row => row.department },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
  ];


  //FETCHING DATA
  useEffect(() => {
    if(!socket) return;

    socket.emit('get_budget_reports', 'get budget report')
    socket.emit('get_audit_history', 'get audit history')

    const handleAuditHistory = (response) => {
      setInflowData(response)
    }

    const handleBudgetReports = (response) => {
      setOutflowData(response)
      setIsLoading(false)
    }

    socket.on('receive_audit_history', handleAuditHistory)
    socket.on("receive_budget_reports", handleBudgetReports);

    return () => {
      socket.off('receive_budget_reports')
      socket.off('receive_audit_history')
    }
  }, [socket])


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
