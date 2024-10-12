import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';


function reviewPaymentTransactions() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [trailsData, setTrailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedRowData, setSelectedRowData] = useState(null);
  const [data, setData] = useState([])

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const socket = useSocket()

  const columns = [
    { name: 'Invoice ID ', selector: row => row._id },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Contact Details', selector: row => row.customerContact },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'Due Date', selector: row => row.dueDate},
    {
      name: 'Items',
      selector: row =>
        row.items
          .map(
            item =>
              `${item.itemName} (Qty: ${item.quantity}, Price: ₱${item.price})`
          )
          .join(', '),
      wrap: true,  width: '300px'
    },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
  ];
  

 // HANDLES FETCHING DATA
useEffect(() => {
  socket.emit("get_paid_records", { msg: "get paid records" });
}, [socket]); // Ensure 'socket' is in the dependency array

useEffect(() => {
  if (!socket) return;

  // Define the event handler
  const handleReceivePaidRecords = (response) => {
    setData(response.records);
    setIsLoading(false);
  };

  // Register the event listener
  socket.on("receive_paid_records", handleReceivePaidRecords);

  // Cleanup function to remove the listener when the component unmounts or 'socket' changes
  return () => {
    socket.off("receive_paid_records", handleReceivePaidRecords);
  };
}, [socket]);


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );
  const handleRowClick = (row) => {
    navigate('/Dashboard/viewReviewPaymentTransactions', { state: { rowData: row } });
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
        <div className="items-center justify-center bg-white rounded-lg shadow-2xl border border-gray-300">
          <div className="mx-4">
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Review Payment Transactions"
                columns={columns}
                data={filteredData}
                pagination
                defaultSortField="name"
                highlightOnHover
                pointerOnHover
                onRowClicked ={handleRowClick}// Add onRowClicked handler
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

export default reviewPaymentTransactions
