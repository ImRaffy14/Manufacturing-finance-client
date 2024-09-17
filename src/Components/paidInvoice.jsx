import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IoCreateOutline } from "react-icons/io5";

function paidInvoice() {
  const [searchText, setSearchText] = useState('');

  const columns = [
    { name: 'Invoice Number', selector: row => row.invoiceNumber },
    { name: 'Invoice Date', selector: row => row.invoiceDate },
    { name: 'DueDate', selector: row => row.dueDate },
    { name: 'Total Ammount', selector: row => row.totalAmount },
    { name: 'Status', selector: row => ( 
                                        <span style={{ color: row.status === 'Paid' ? 'green' : 'inherit',
                                          fontWeight: 'bold' 
                                         }}>
                                        {row.status}
                                        </span>) },
  ];
  
  const data = [
    { invoiceNumber: 1, invoiceDate: '2024/05/19', dueDate: '2024/06/19', status: 'Paid', totalAmount: 1209,},
    { invoiceNumber: 1, invoiceDate: '2024/05/19', dueDate: '2024/06/19', status: 'Paid', totalAmount: 1209,},
    { invoiceNumber: 1, invoiceDate: '2024/05/19', dueDate: '2024/06/19', status: 'Paid', totalAmount: 1209,},
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



  return (

    <>
    
      
      <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Paid/Closed Invoices"
                            columns={columns}
                            data={filteredData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
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



export default paidInvoice;
