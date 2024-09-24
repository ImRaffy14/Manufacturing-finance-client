import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";
import { useSocket } from '../context/SocketContext';

function pendingInvoice() {
  const [searchText, setSearchText] = useState('');
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [pendingInvoicesCount, setPendingInvoicesCount] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data
  const [pendingInvoiceData, setPendingInvoiceData] = useState([]) // pending invoice data
  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()

  const columns = [
    { name: 'Invoice Number', selector: row => row._id },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'DueDate', selector: row => row.dueDate },
    { name: 'Payment Terms', selector: row => row.paymentTerms },
    { name: 'Total Amount', selector: row => row.totalAmount },
    { name: 'Status', selector: row => ( 
                                <span style={{ color: row.Status === 'Pending' ? 'red' : 'inherit',
                                  fontWeight: 'bold' 
                                 }}>
                                {row.Status}
                                </span>) },
  ];
  
  const data = pendingInvoiceData;

  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT
  //TANGINAMO ANGELO AYUSIN MO TONG PART NA TO, LAHAT PALABASIN MO SA ROW IKAW NA MAG KABIT

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
    const pendingCount = data.filter(row => row.status === 'Pending').length;

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
            <h3 className="font-bold text-lg">Details for Invoice: {selectedRowData.invoiceNumber}</h3>
            <div className="py-4">
              <p><strong>Invoice Number:</strong> {selectedRowData._id}</p>
              <p><strong>Invoice Date:</strong> {selectedRowData.invoiceDate}</p>
              <p><strong>Due Date:</strong> {selectedRowData.dueDate}</p>
              <p><strong>Total Amount:</strong> {selectedRowData.totalAmount}</p>
              <p><strong>Status:</strong> {selectedRowData.status}</p>
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
