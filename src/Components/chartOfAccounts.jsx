import React, { useState, useRef } from "react";
import DataTable from 'react-data-table-component';

function ChartOfAccounts() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);

  const modalRef = useRef(null); // Using useRef to directly reference the modal element

  const columns = [
    { name: 'Account Number', selector: row => row.accountNumber },
    { name: 'Account Name', selector: row => row.accountName },
    { name: 'Category', selector: row => row.category },
    { name: 'Subcategory', selector: row => row.subCategory },
    { name: 'Balance', selector: row => row.balance },
    { name: 'Description', selector: row => row.description },
  ];

  const data = [
    { id: 1, accountNumber: "1001", accountName: "Cash", category: "Asset", subCategory: "secret", balance: 50000, description: '12123123eqeqweqwe' },
    { id: 2, accountNumber: "2001", accountName: "Accounts Payable", category: "Liability", subCategory: "secret", balance: 15000, description: '12123123eqeqweqwe' },
    { id: 3, accountNumber: "3001", accountName: "Revenue", category: "Income", subCategory: "secret", balance: 80000, description: '12123123eqeqweqwe' },
    { id: 4, accountNumber: "4001", accountName: "Office Expenses", category: "Expense", subCategory: "secret", balance: 10000, description: '12123123eqeqweqwe' },
  ];

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`;
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('chart_of_accounts_modal').showModal();
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
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
                title="Chart Of Accounts"
                columns={columns}
                data={filteredData}
                pagination
                defaultSortField="name"
                highlightOnHover
                pointerOnHover
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
                onRowClicked={handleRowClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRowData && (
        <dialog ref={modalRef} id="chart_of_accounts_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Account Details</h1>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="font-medium"><strong>Account Number:</strong></p>
                <p className="text-gray-700">{selectedRowData.accountNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Account Name:</strong></p>
                <p className="text-gray-700">{selectedRowData.accountName}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Category:</strong></p>
                <p className="text-gray-700">{selectedRowData.category}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Subcategory:</strong></p>
                <p className="text-gray-700">{selectedRowData.subCategory}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Balance:</strong></p>
                <p className="text-gray-700">{formatCurrency(selectedRowData.balance)}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium"><strong>Description:</strong></p>
                <p className="text-gray-700 max-w-2xl">{selectedRowData.description}</p>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('chart_of_accounts_modal').close()}>
              Close
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}

export default ChartOfAccounts;
