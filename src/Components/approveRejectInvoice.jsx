import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";

function approveRejectInvoice() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null); 
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const columns = [
    { name: 'Request ID', selector: row => row.requestNumber },
    { name: 'Requested by', selector: row => row.name },
    { name: 'Invoice Number', selector: row => row.invoiceNumber },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount)},
    { name: 'Status',
                    selector: row => (
                      <span style={{ 
                        color: row.status === 'Rejected' ? 'red' : row.status === 'Approved' ? 'green' : 'inherit',
                        fontWeight: 'bold' 
                      }}>
                        {row.status}
                      </span>)
                      },
    { name: 'Reason', selector: row => row.reason },
    
  ];
  
  const data = [
    { requestNumber: 1, name: 'Muhammad Sumbul', invoiceNumber: 1, invoiceDate: '2024/05/19', dueDate: '2024/06/19', paymentTerms: 'lagyan ng puday', totalAmount: 1209, status: 'Approved', reason:'Complete Documents'},
    { requestNumber: 44, name: 'Usman Abdal Jaleel Shisha', invoiceNumber: 300, invoiceDate: '2024/05/19', dueDate: '2024/06/19', paymentTerms: 'lagyan ng puday', totalAmount: 1209, status: 'Rejected', reason:'Makapal mukha'},
    { requestNumber: 120, name: 'Khalid Khasmiri', invoiceNumber: 200, invoiceDate: '2024/05/19', dueDate: '2024/06/19', paymentTerms: 'lagyan ng puday', totalAmount: 1209, status: 'Approved', reason:'Complete Documents'},
    // Add more data as needed
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Filter data based on search text
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );


  //modal data
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerContact: '',
    customerId: '',
    orderNumber: '',
    orderDate: '',
    shippingMethod: '',
    deliveryDate: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    paymentTerms: '',
    subtotal: 0,
    taxes: 0,
    discounts: 0,
    totalAmount: 0,
    terms: '',
    notes: '',
  });

  

  const [items, setItems] = useState([{ itemName: '', quantity: 1, price: 0 }]);

  const itemOptions = [
    { label: 'Soap A', value: 'soap_a', price: 10 },
    { label: 'Soap B', value: 'soap_b', price: 15 },
    { label: 'Soap C', value: 'soap_c', price: 20 }
  ];

  useEffect(() => {
    calculateTotal();
  }, [items, formData.taxes, formData.discounts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const calculateTotal = () => {
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const taxes = parseFloat(formData.taxes || 0);
    const discounts = parseFloat(formData.discounts || 0);
    const totalAmount = subtotal + taxes - discounts;

    setFormData((prevData) => ({
      ...prevData,
      subtotal,
      totalAmount,
    }));
  };
  // Handle row click to show modal
  const handleRowClick = (row) => {
    setSelectedRowData(row);
    document.getElementById('row_modal').showModal();
  };

  return (

    <>
    
      
      <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Supplier Invoice"
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
            <h3 className="font-bold text-lg">Details for Supplier ID: {selectedRowData.supplierNumber}</h3>
            <div className="py-4">
              <p><strong>Request ID:</strong> {selectedRowData.requestNumber}</p>
              <p><strong>Requested by:</strong> {selectedRowData.name}</p>
              <p><strong>Invoice Number:</strong> {selectedRowData.invoiceNumber}</p>
              <p><strong>Total Amount:</strong> {selectedRowData.totalAmount}</p>
              <p><strong>Status:</strong> {selectedRowData.status}</p>
              <p><strong>Reason:</strong> {selectedRowData.reason}</p>
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



export default approveRejectInvoice;
