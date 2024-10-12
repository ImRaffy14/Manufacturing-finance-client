import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";
import { useSocket } from '../context/SocketContext';
function paidInvoice() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  const [nonPendingInvoice, setNonPendingInvoice] = useState([]) // non pending invoice
  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()

    // Function to format the price with Philippine Peso and commas
    const formatCurrency = (value) => {
      return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };
  

  const columns = [
    { name: 'Invoice ID ', selector: row => row._id },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Contact Details', selector: row => row.customerContact },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'DueDate', selector: row => row.dueDate },
    { name: 'Items', selector: row => row.items.map
      (item => `${item.itemName} (Qty: ${item.quantity}, Price: ₱${item.price})`).join(', '), 
                  wrap: true // Optional: wrap text to avoid overflow
    },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount)},
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.Status === 'Paid' ? 'green' : row.Status === 'To review' ?  'blue' : 'red' ,
                                  fontWeight: 'bold' 
                                 }}>
                                {row.Status}
                                </span>) },
                                
  ];
  
  const data = nonPendingInvoice;

  //FETCHING NON PENDING INVOICE DATA
  useEffect(() => {
    if(!socket) return;

    socket.emit("get_non_pending_invoice", {msg: "get non pending invoice"})

    socket.on("receive_non_pending_invoice", (response) => {
      setNonPendingInvoice(response)
      setIsLoading(false)
  })

  }, [socket])


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Filter data based on search text
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );


 // Handle row click to show modal
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
                            onRowClicked={handleRowClick} // Add onRowClicked handler
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
          <div className="modal-box">
            <h3 className="font-bold text-lg">Details for Customer: {selectedRowData.customerName}</h3>
            <div className="py-4">
              <p><strong>Invoice Number:</strong> {selectedRowData._id}</p>
              <p><strong>Invoice Date:</strong> {selectedRowData.invoiceDate}</p>
              <p><strong>Due Date:</strong> {selectedRowData.dueDate}</p>
              <p><strong>Total Amount:</strong> {selectedRowData.totalAmount}</p>
              <p><strong>Items:</strong> {selectedRowData.items.map
              (item => `${item.itemName} (Qty: ${item.quantity}, Price: ₱${item.price})`)}</p>
              <p><strong>Customer ID:</strong> {selectedRowData.customerId}</p>
              <p><strong>Customer Name:</strong> {selectedRowData.customerName}</p>
              <p><strong>Customer Contact:</strong> {selectedRowData.customerContact}</p>
              <p><strong>Status:</strong> {selectedRowData.Status}</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => document.getElementById('row_modal').close()}
            >
              Close
            </button>
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



export default paidInvoice;
