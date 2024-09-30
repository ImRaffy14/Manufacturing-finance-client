import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

function reviewPaymentTransactions() {
  const [searchText, setSearchText] = useState('');
  const [trailsData, setTrailsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold the selected row data

  const columns = [
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'User ID', selector: row => row._id },
    { name: 'Username', selector: row => row.userName },
    { name: 'Role', selector: row => row.role },
    { name: 'Action', selector: row => row.action },
    { name: 'Description', selector: row => row.description },
  ];
  const data = trailsData;
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );
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
                onRowClicked // Add onRowClicked handler
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
