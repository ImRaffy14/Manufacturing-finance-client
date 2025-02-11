import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

import { useSocket } from '../context/SocketContext'

function chartOfAccounts() {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true)



  

  const columns = [
    { name: 'Account Number', selector: row => row.accountNumber},
    { name: 'Account Name', selector: row => row.accountName},
    { name: 'Type', selector: row => row.type},
    { name: 'Balance', selector: row => row.balance },
  ];

  const data =[
    { id: 1, accountNumber: "1001", accountName: "Cash", type: "Asset", balance: 50000 },
    { id: 2, accountNumber: "2001", accountName: "Accounts Payable", type: "Liability", balance: 15000 },
    { id: 3, accountNumber: "3001", accountName: "Revenue", type: "Income", balance: 80000 },
    { id: 4, accountNumber: "4001", accountName: "Office Expenses", type: "Expense", balance: 10000 },
  ]
   
  


 
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleResolveClick = (row) => {
    console.log("Resolved Row Data:", row);
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default chartOfAccounts;
