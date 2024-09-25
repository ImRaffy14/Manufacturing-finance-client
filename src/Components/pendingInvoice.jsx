import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/JJM.jfif';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";
import { useSocket } from '../context/SocketContext';

function pendingInvoice() {
  const invoiceRef = useRef(null);

  const handleGeneratePdf = async () => {
    const inputData = invoiceRef.current;
    try {
      const canvas = await html2canvas(inputData);
      const imgData = canvas.toDataURL("image/png");

      const customWidth = 500;  // Adjust this value to set your custom width
      const customHeight =700; // Adjust this value to set your custom height

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [customWidth, customHeight],
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${selectedRowData.customerName} ${selectedRowData._id}`);
      isSubmitted(false)
    } catch (error) {
      console.log(error);
    }
  };

  // Function to format the price with Philippine Peso and commas
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const [searchText, setSearchText] = useState('');
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [pendingInvoicesCount, setPendingInvoicesCount] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  const [pendingInvoiceData, setPendingInvoiceData] = useState([]) // pending invoice data
  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()

  const columns = [
    { name: 'Invoice ID ', selector: row => row._id },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Contact Details', selector: row => row.customerContact },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'DueDate', selector: row => row.dueDate },
    { name: 'Payment Terms', selector: row => row.paymentTerms },
    { name: 'Items', selector: row => row.items.map
      (item => `${item.itemName} (Qty: ${item.quantity}, Price: ₱${item.price})`).join(', '), 
                  wrap: true // Optional: wrap text to avoid overflow
    },
    { name: 'Total Amount', selector: row => row.totalAmount },
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.Status === 'Pending' ? 'red' : 'inherit',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.Status}
                                </span>) },
                                
  ];
  
  const data = pendingInvoiceData;
  console.log(pendingInvoiceData);

  //FETCHING PENDING INVOICE DATA
  useEffect(() => {
    if(!socket) return;

    socket.emit("get_pending_invoice", {msg: "get pending invoice"})

    socket.on("receive_pending_invoice", (response) => {
      setPendingInvoiceData(response)
      setIsLoading(false)
    })

  }, [socket])

  useEffect(() => {
    calculateAccumulatedAmountAndPendingInvoices();
  }, [data]);

  // Function to calculate the accumulated amount and pending invoices count
  const calculateAccumulatedAmountAndPendingInvoices = () => {
    const totalAmount = data.reduce((acc, row) => acc + row.totalAmount, 0);
    const pendingCount = data.filter(row => row.Status === 'Pending').length;

    setAccumulatedAmount(totalAmount);
    setPendingInvoicesCount(pendingCount);
  };


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Filter data based on search text
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );
  const confirmSubmission = () => {
    socket.emit("create_invoice", pendingInvoiceData);
  };

  
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
    

      <div className="max-w-screen-2xl mx-auto mt-[50px]">
      <div className="flex space-x-4 mb-[15px]">
        <div className="stats shadow mb-3">
          <div className="stat">
            <div className="stat-title">Pending Invoice</div>
            <div className="stat-value">{pendingInvoicesCount}</div>
          </div>
        </div>

        <div className="stats h-[150px] w-[270px] shadow mb-3">
          <div className="stat">
             <div className="stat-title">Accumulated Amount</div>
              <div className="stat-value">{accumulatedAmount}</div>
            </div>
        </div>

        </div>
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-[15px]">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                      <div className="flex p-2">
                      </div>
                        <DataTable
                            title="Pending Invoices"
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
            
          <div ref={invoiceRef} className="invoice-container bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Invoice</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <p><strong>Customer ID:</strong> {selectedRowData.customerId}</p>
          <p><strong>Name:</strong> {selectedRowData.customerName}</p>
          <p><strong>Contact:</strong> {selectedRowData.customerContact}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Invoice Information</h3>
          <p><strong>Invoice ID:</strong> {selectedRowData._id}</p>
          <p><strong>Invoice Date:</strong> {selectedRowData.invoiceDate}</p>
          <p><strong>Due Date:</strong> {selectedRowData.dueDate}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <p><strong>Payment Terms:</strong> {selectedRowData.paymentTerms}</p>
        </div>
        <div className="mt-10">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">DESCRIPTION</th>
                <th className="py-2 text-right">UNIT PRICE</th>
                <th className="py-2 text-right">QTY</th>
                <th className="py-2 text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {selectedRowData.items && selectedRowData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.itemName}</td>
                  <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtotal, Discounts, and Total */}
        <div className="mt-8">
          <div className="border-t-2 border-gray-300 my-2"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right">
              <p className="text-lg font-bold"><strong>TOTAL AMOUNT:</strong></p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(selectedRowData.totalAmount || 0)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
          <button
            type="button"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            onClick={confirmSubmission} // Trigger submission
          >
            Submit Invoice
          </button>
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



export default pendingInvoice;
