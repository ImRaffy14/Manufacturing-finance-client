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

      const customWidth = 700;  // Adjust this value to set your custom width
      const customHeight = 700; // Adjust this value to set your custom height

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

  //FETCHING PENDING INVOICE DATA
  useEffect(() => {
    if(!socket) return;

    socket.emit("get_pending_invoice", {msg: "get pending invoice"})

    socket.on("receive_pending_invoice", (response) => {
      setPendingInvoiceData(response.pendingSales)
      setAccumulatedAmount(response.pendingSalesCount.totalAmount);
      setPendingInvoicesCount(response.pendingSalesCount.totalCount);
      console.log(response.pendingSalesCount)
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
          <div className="modal-box  w-full h-full max-w-[1000px]">
            <div className="invoice-container bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div className="text-left">
                  <h2 className="text-4xl  font-semibold mb-4"><strong>{selectedRowData.Status}</strong></h2>
                </div>
                <div className="text-right ">
              <p><strong>Create Date:</strong> {selectedRowData.createdAt || '01234'}</p>
              <p><strong>Date Updated:</strong> {selectedRowData.updatedAt || '11.02.2030'}</p>
            </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between">
            <div className="text-left">
              {/* cUSTOMER INFO */}
              <h3 className="text-lg font-semibold"><strong>Customer Information</strong></h3>
              <p><strong>Customer ID:</strong> {selectedRowData.customerId}</p>
              <p><strong>Name:</strong> {selectedRowData.customerName}</p>
              <p><strong>Contact:</strong> {selectedRowData.customerContact}</p>
              <p><strong>Address:</strong> {selectedRowData.customerAddress}</p>
            </div>
          
            <div className="text-right">
          {/* Invoice Info */}
          <h3 className="text-lg font-semibold"><strong>Invoice Information</strong></h3>
            <p><strong>INVOICE ID:</strong> {selectedRowData._id || '01234'}</p>
            <p><strong>DATE:</strong> {selectedRowData.invvoiceDate || '11.02.2030'}</p>
            <p><strong>DUE DATE:</strong> {selectedRowData.dueDate || '11.03.2030'}</p>
            </div>
            </div>

             {/* Shipping Information */}
          <h3 className="text-lg font-bold mt-5"><strong>Delivery Information</strong></h3>
            <p><strong>Shipping Method:</strong> {selectedRowData.shippingMethod || '01234'}</p>
            <p><strong>Delivery Date:</strong> {selectedRowData.deliveryDate || '11.02.2030'}</p>

            {/* TERMS AND NOTES */}
          <h3 className="text-lg font-bold mt-5"><strong>Payment Terms</strong></h3>
            <p><strong>Payment Terms:</strong> {selectedRowData.terms || '01234'}</p>
            <p><strong>Note:</strong> {selectedRowData.note || 'Dilaan mo ang burat kong makatas'}</p>
        </div>
        

        <div className="mt-10">
          
          {/* Order Info */}
          <h3 className="text-lg mt-5 font-semibold"><strong>Order Information</strong></h3>
          <div className="flex flex-col">
            <p><strong>Order Number:</strong> {selectedRowData.orderNumber || '01234'}</p>
            <p><strong>Order Date:</strong> {selectedRowData.orderDate || '11.02.2030'}</p>
            </div>

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
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right">
              <p><strong>SUBTOTAL:</strong></p>
              <p><strong>DISCOUNTS:</strong></p>
            </div>
            <div className="text-right">
              <p>{formatCurrency(selectedRowData.subTotal || 0)}</p>
              <p>{formatCurrency(selectedRowData.discounts || 0)}</p>
            </div>
          </div>

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


        {/* INvoice ref */}
        <div className="container mx-auto p-4">
      {/* Invoice layout */}
      <div ref={invoiceRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          visibility: 'visible', // Ensure it's visible to html2canvas
        }}
        className="p-10"
>
        {/* Logo and Invoice Title */}
        <div className="flex justify-between items-center mb-4">
          <img src={logo} alt="Company Logo" className="w-32 h-auto" /> {/* Adjust size as necessary */}
          <h1 className="text-4xl font-bold tracking-wide text-right">INVOICE</h1>
        </div>

        {/* Customer Information */}
        <div className="flex justify-between mt-10">
          <div className="text-left">
            <p><strong>ISSUED TO:</strong></p>
            <p>{selectedRowData.customerName || 'Customer Name'}</p>
            <p>{selectedRowData.customerAddress || 'Customer Address'}</p>
            <p>{selectedRowData.customerContact || 'Customer Contact'}</p>
          </div>

          <div className="text-right">
            <p><strong>INVOICE ID:</strong> {selectedRowData._id || '01234'}</p>
            <p><strong>DATE:</strong> {selectedRowData.invoiceDate || '11.02.2030'}</p>
            <p><strong>DUE DATE:</strong> {selectedRowData.dueDate || '11.03.2030'}</p>
          </div>
        </div>

        {/* Shipping and Payment Information */}
        <div className="mt-8">
          <p><strong>PAY TO:</strong></p>
          <p>Shipping Method: {selectedRowData.shippingMethod || 'Standard Shipping'}</p>
          <p>Delivery Date: {selectedRowData.deliveryDate || '11.04.2030'}</p>
        </div>

        {/* Order Details Table */}
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
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right">
              <p><strong>SUBTOTAL:</strong></p>
              <p><strong>DISCOUNTS:</strong></p>
            </div>
            <div className="text-right">
              <p>{formatCurrency(selectedRowData.subTotal || 0)}</p>
              <p>{formatCurrency(selectedRowData.discounts || 0)}</p>
            </div>
          </div>

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

        {/* Terms and Notes */}
        <div className="mt-10">
          <p><strong>TERMS AND CONDITIONS:</strong></p>
          <p>{selectedRowData.terms || 'Default terms and conditions.'}</p>
        </div>

        <div className="mt-4">
          <p><strong>NOTES:</strong></p>
          <p>{selectedRowData.notes || 'Additional notes.'}</p>
        </div>
      </div>
    </div>




      <div className="text-center mt-4">
          <button
            type="button"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            onClick={handleGeneratePdf} // Trigger submission
          >
            Download Preview
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
