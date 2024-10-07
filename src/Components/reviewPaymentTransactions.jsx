import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

function reviewPaymentTransactions() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [trailsData, setTrailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const columns = [
    { name: 'Invoice ID ', selector: row => row._id },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Contact Details', selector: row => row.customerContact },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'Paid Date', selector: row => row.paidDate },
    {
      name: 'Items',
      selector: row =>
        row.items
          .map(
            item =>
              `${item.itemName} (Qty: ${item.quantity}, Price: ₱${item.price})`
          )
          .join(', '),
      wrap: true, // Optional: wrap text to avoid overflow
    },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
  ];
  
  const data = [
    {
      _id: '1',
      customerId: '1',
      customerName: 'John Doe',
      customerContact: '090909009',
      invoiceDate: '12/12/2024',
      paidDate: '12/14/2024',
      items: [
        { itemName: 'JJM Soap A', quantity: 2, price: 100 },
        { itemName: 'JJM Soap B', quantity: 1, price: 150 },
        { itemName: 'JJM Soap C', quantity: 3, price: 200 },
      ],
      totalAmount: '950', // Adjust the total amount to reflect the added items
    },
  ];
  
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
  return (
    <>
     <div className="max-w-screen-2xl mx-auto mt-4">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
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
