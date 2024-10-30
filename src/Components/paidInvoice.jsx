import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";
import { useSocket } from '../context/SocketContext';

function PaidInvoice() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [nonPendingInvoice, setNonPendingInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  const formatCurrency = (value) => `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const columns = [
    { name: 'Invoice ID', selector: row => row._id },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Contact Details', selector: row => row.customerContact },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'Due Date', selector: row => row.dueDate },
    {
      name: 'Items', 
      selector: row => row.items.map(item => `${item.itemName} (Qty: ${item.quantity}, Price: ${formatCurrency(item.price)})`).join(', '),
      wrap: true 
    },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
    { 
      name: 'Status', 
      selector: row => (
        <span style={{ color: row.Status === 'Paid' ? 'green' : row.Status === 'To review' ? 'blue' : 'red', fontWeight: 'bold' }}>
          {row.Status}
        </span>
      )
    }
  ];

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_non_pending_invoice", { msg: "get non pending invoice" });
    socket.on("receive_non_pending_invoice", (response) => {
      setNonPendingInvoice(response);
      setIsLoading(false);
    });
  }, [socket]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = nonPendingInvoice.filter(row =>
    Object.values(row).some(value => value.toString().toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
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
      <div className="max-w-screen-2xl mx-auto mt-4">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
          <div className="mx-4">
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Paid/Closed Invoices"
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

      {/* Modal for displaying row data */}
      {selectedRowData && (
        <dialog id="row_modal" className="modal">
          <div className="modal-box w-full max-w-[1200px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Paid/Closed Invoice Preview</h1>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">
              Details for Customer: <strong>{selectedRowData.customerName}</strong>
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="font-medium"><strong>Invoice Number:</strong></p>
                <p className="text-gray-700">{selectedRowData._id}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Invoice Date:</strong></p>
                <p className="text-gray-700">{selectedRowData.invoiceDate}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Due Date:</strong></p>
                <p className="text-gray-700">{selectedRowData.dueDate}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Total Amount:</strong></p>
                <p className="text-gray-700">{formatCurrency(selectedRowData.totalAmount)}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Customer ID:</strong></p>
                <p className="text-gray-700">{selectedRowData.customerId}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Customer Contact:</strong></p>
                <p className="text-gray-700">{selectedRowData.customerContact}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Status:</strong></p>
                <p className="text-gray-700">{selectedRowData.Status}</p>
              </div>
              <div>
                <p className="font-medium"><strong>Items:</strong></p>
                <ul className="list-disc list-inside ml-5 text-gray-700">
                  {selectedRowData.items.map((item, index) => (
                    <li key={index} className="py-1">
                      <strong>{item.itemName}</strong> - Qty: {item.quantity}, Unit Price: {formatCurrency(item.price)}, Total: {formatCurrency(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('row_modal').close()}>
              Close
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}

export default PaidInvoice;
