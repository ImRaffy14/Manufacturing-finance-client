import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext"
import DataTable from 'react-data-table-component';

function ChartOfAccounts() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [balance, setBalance] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const socket = useSocket()

  const modalRef = useRef(null);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`;
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Account Code', selector: row => row.accountCode, width:"120px" },
    { name: 'Account Name', selector: row => row.accountName, width:"300px"},
    { name: 'Category', selector: row => row.category, width:"180px" },
    { name: 'Subcategory', selector: row => row.subCategory, width:"230px" },
    { name: 'Description', selector: row => row.description, width:"470px" },
    { name: 'Balance', selector: row => formatCurrency(row.balance) },
    
  ];

  // GET CURRENT MONTH
  function getCurrentMonthString() {
    const date = new Date(); 
    const month = date.toLocaleString('default', { month: 'long' }); 

    return `month of ${month}`; 
}

  useEffect(() => {
    if(!socket) return

    socket.emit("get_chart_of_account")

    // HANDLE CHART OF ACCOUNTS DATA
    const handleChartOfAccounts = (response) => {
      setBalance(response)
      setIsLoading(false)
    }

    socket.on('receive_chart_of_account', handleChartOfAccounts)

    return () => {
      socket.off('receive_chart_of_account')
    }

  }, [socket])

  const data = [
    {  accountCode: "101", accountName: "Total Cash", category: "Asset", subCategory: "Current Asset", description: 'Cash Available Operations' ,balance: balance.totalCash, },
    {  accountCode: "201", accountName: "Accounts Payable-Raw Materials", category: "Liability", subCategory: "Current Liability" ,description: 'Amount owed for procured raw materials', balance: balance.payableRawMaterials,  },
    {  accountCode: "202", accountName: "Accounts Payable-machinery", category: "Liability", subCategory: "Current Liability" ,description: 'Amount owed for procured machinery', balance: balance.payableMachinery,  },
    {  accountCode: "203", accountName: "Accounts Payable-Salary & Wages", category: "Liability", subCategory: "Current Liability" ,description: 'Salary and wages payable to employees', balance: balance.payableSalaryAndWages,  },
    {  accountCode: "204", accountName: "Accounts Payable-Utilities", category: "Liability", subCategory: "Current Liability" ,description: 'Outstanding bills for utilities', balance: balance.payableUtilities,  },
    {  accountCode: "205", accountName: "Accounts Payable-Company Activities", category: "Liability", subCategory: "Current Liability" ,description: 'Amount owed for company-related activities and operations', balance: balance.payableCompanyActivites,  },
    {  accountCode: "206", accountName: "Accounts Receivable-Purchase Orders", category: "Asset", subCategory: "Current Asset" ,description: 'Unpaid purchase orders or purchase orders that are in process', balance: balance.receivablePurchaseOrder,  },
    {  accountCode: "301", accountName: "Total Sales", category: "Revenue", subCategory: "Sales Revenue" ,description: `Income generated from product sales ${getCurrentMonthString()}`, balance: balance.totalSales  },
    {  accountCode: "401", accountName: "Raw Material Expenses", category: "Expense", subCategory: "Cost of Goods Sold" ,description: `Cost incurred for raw materials ${getCurrentMonthString()}`, balance: balance.rawMaterialExpenses,  },
    {  accountCode: "402", accountName: "Machinery Expenses", category: "Expense", subCategory: "Operating Expense" ,description: `Costs for machine maintenance/purchase ${getCurrentMonthString()}`, balance: balance.laborCostExpenses,  },
    {  accountCode: "403", accountName: "Salary & Wages Expense", category: "Expense", subCategory: "Operating Expense" ,description: `Employee salaries and wages ${getCurrentMonthString()}`, balance: balance.salariesAndWagesExpenses,  },
    {  accountCode: "404", accountName: "Utilities Expense", category: "Expense", subCategory: "Operating Expense" ,description: `Electricity, water, and other utility costs ${getCurrentMonthString()}`, balance: balance.utilitiesExpenses,  },
    {  accountCode: "405", accountName: "Company Activities Expense", category: "Expense", subCategory: "Operating Expense" ,description: `Costs incurred for company operations and activities ${getCurrentMonthString()}`, balance: balance.companyActivitiesExpenses,  },
  ];



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

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-screen w-full"></div>
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
                title="Chart Of Accounts"
                columns={columns}
                data={filteredData}
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
                <p className="font-medium"><strong>Account Code:</strong></p>
                <p className="text-gray-700">{selectedRowData.accountCode}</p>
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
