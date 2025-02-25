import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useSocket } from "../context/SocketContext";

function TransactionRecords() {
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [inflowSearchText, setInflowSearchText] = useState('');
  const [outflowSearchText, setOutflowSearchText] = useState('');
  const [inflowData, setInflowData] = useState([]);
  const [outflowData, setOutflowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedInflow, setSelectedInflow] = useState(null);
  const [selectedOutflow, setSelectedOutflow] = useState(null);

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const inflowColumns = [
    { name: 'Transaction ID', selector: row => row._id },
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'Auditor ID', selector: row => row.auditorId },
    { name: 'Auditor', selector: row => row.auditor },
    { name: 'P.Order ID', selector: row => row.invoiceId },
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
    if (!socket) return;

    socket.emit('get_budget_reports', 'get budget report');
    socket.emit('get_audit_history', 'get audit history');

    const handleAuditHistory = (response) => {
      setInflowData(response);
    };

    const handleBudgetReports = (response) => {
      setOutflowData(response);
      setIsLoading(false);
    };

    socket.on('receive_audit_history', handleAuditHistory);
    socket.on("receive_budget_reports", handleBudgetReports);

    return () => {
      socket.off('receive_budget_reports');
      socket.off('receive_audit_history');
    };
  }, [socket]);

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

  const handleInflowRowClick = (row) => {
    setSelectedInflow(row);
    document.getElementById("inflow_modal").showModal();
  };

  const handleOutflowRowClick = (row) => {
    setSelectedOutflow(row);
    document.getElementById("outflow_modal").showModal();
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
      {/* Inflow Table */}
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
              onRowClicked={handleInflowRowClick}
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

      {/* Outflow Table */}
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
              onRowClicked={handleOutflowRowClick}
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

  {/* INFLOW MODAL */}
{selectedInflow && (
  <dialog id="inflow_modal" className="modal">
    <div className="modal-box w-full max-w-[1200px] rounded-xl shadow-2xl bg-white p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Inflow Transaction Preview</h1>
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">
        Details for Transaction ID : <strong>{selectedInflow._id}</strong>
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium"><strong>Date & Time:</strong></p>
          <p className="text-gray-700">{selectedInflow.dateTime}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Auditor ID:</strong></p>
          <p className="text-gray-700">{selectedInflow.auditorId}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Auditor:</strong></p>
          <p className="text-gray-700">{selectedInflow.auditor}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>P.Order ID:</strong></p>
          <p className="text-gray-700">{selectedInflow.invoiceId}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Customer Name:</strong></p>
          <p className="text-gray-700">{selectedInflow.customerName}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Total Amount:</strong></p>
          <p className="text-gray-700">{formatCurrency(selectedInflow.totalAmount)}</p>
        </div>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button type="button" onClick={() => document.getElementById('inflow_modal').close()}>
        Close
      </button>
    </form>
  </dialog>
)}

{/* OUTFLOW MODAL */}
{selectedOutflow && (
  <dialog id="outflow_modal" className="modal">
    <div className="modal-box w-full max-w-[1200px] rounded-xl shadow-2xl bg-white p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Outflow Transaction Preview</h1>
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">
        Details for Transaction ID : <strong>{selectedOutflow._id}</strong>
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium"><strong>Date & Time:</strong></p>
          <p className="text-gray-700">{selectedOutflow.dateTime}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Approver ID:</strong></p>
          <p className="text-gray-700">{selectedOutflow.approverId}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Approver:</strong></p>
          <p className="text-gray-700">{selectedOutflow.approver}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Payable ID:</strong></p>
          <p className="text-gray-700">{selectedOutflow.payableId}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Category:</strong></p>
          <p className="text-gray-700">{selectedOutflow.category}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Department:</strong></p>
          <p className="text-gray-700">{selectedOutflow.department}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Total Amount:</strong></p>
          <p className="text-gray-700">{formatCurrency(selectedOutflow.totalAmount)}</p>
        </div>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button type="button" onClick={() => document.getElementById('outflow_modal').close()}>
        Close
      </button>
    </form>
  </dialog>
)}

    </>
  );
}

export default TransactionRecords;
