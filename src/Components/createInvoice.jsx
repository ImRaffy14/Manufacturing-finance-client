import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { toPng } from "html-to-image";
import { IoCreateOutline } from "react-icons/io5";
import InvoiceDownload from './invoiceDownload';

function CreateInvoice() {
  const [isSubmitted, setIsSubmitted] = useState(false);  // Track form submission
  const [searchText, setSearchText] = useState('');

  const columns = [
    { name: 'Order Number', selector: row => row.orderNumber },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Customer Address', selector: row => row.customerAddress },
    { name: 'Orders', selector: row => row.orderItem },
    { name: 'Contact Information', selector: row => row.contactInformation },
    { name: 'Create Invoice', selector: row => (<a className="text-4xl"><IoCreateOutline className="  hover:cursor-pointer" 
                                                                 onClick={() => document.getElementById('invoice_modal').showModal()}/></a>
          
      ) },
  ];
  
  const data = [
    { orderNumber: 1, customerId: 1, customerName: 'Burarrat', customerAddress: 'Edinburgh', orderItem: 'Suka, tubig, patis', contactInformation: '0909090909', createInvoice: '' },
    { orderNumber: 2, customerId: 2, customerName: 'Burarrat', customerAddress: 'Edinburgh', orderItem: 'Suka, tubig, patis', contactInformation: '0909090909', createInvoice: '' },
    { orderNumber: 3, customerId: 3, customerName: 'Burarrat', customerAddress: 'Edinburgh', orderItem  : 'Suka, tubig, patis', contactInformation: '0909090909', createInvoice: '' },
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
  const defaultTerms = `These are the terms and conditions:
  - All purchases are final.
  - No refunds after 30 days.
  - Users must agree to the privacy policy.
  `;
  const invoiceRef = useRef(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerContact: '',
    customerId: '',
    orderNumber: '',
    orderDate: '',
    shippingMethod: '',
    deliveryDate: '',
    invoiceDate: '',
    dueDate: '',
    subtotal: 0,
    discounts: 0,
    totalAmount: 0,
    terms: defaultTerms, 
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

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    
    if (name === 'itemName') {
      const selectedItem = itemOptions.find((item) => item.label === value);
      updatedItems[index].price = selectedItem ? selectedItem.price : 0;
    }
    
    setItems(updatedItems);
  };


  const handleQuantityChange = (index, e) => {
    const { value } = e.target;
    const updatedItems = [...items];
    updatedItems[index].quantity = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
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

  const handleGenerateImage = () => {
    if (invoiceRef.current) {
      toPng(invoiceRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "invoice.png"; // Download the image
          link.click();
        })
        .catch((err) => {
          console.error("Error generating invoice image", err);
        });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log('Form submitted:', formData, items);
  };
  if (isSubmitted) {
    return <InvoiceDownload invoiceData={formData} />;
  }

  return (

    <>
    
      
      <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Invoice Creation"
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


   {/* Open the modal using document.getElementById('ID').showModal() method */}
   
   <dialog id="invoice_modal" className="modal">
       <div className="modal-box w-full max-w-7xl ">
       <div ref={invoiceRef} className="invoice-container bg-white p-8 rounded-lg shadow-md">
     <h2 className="text-center text-2xl font-bold mb-6">Create Invoice</h2>

     <form onSubmit={handleSubmit}>
       {/* Customer Information */}
       <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
       <div className="grid grid-cols-3 gap-4 mb-6">
         <div>
           <label className="block mb-2 font-semibold">Customer Name</label>
           <input
             type="text"
             name="customerName"
             value={formData.customerName}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter customer name"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Customer Address</label>
           <input
             type="text"
             name="customerAddress"
             value={formData.customerAddress}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter customer address"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Contact Information</label>
           <input
             type="text"
             name="customerContact"
             value={formData.customerContact}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter contact info"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Customer ID</label>
           <input
             type="text"
             name="customerId"
             value={formData.customerId}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter customer ID"
           />
         </div>
       </div>

       {/* Order Details */}
       <h3 className="text-lg font-semibold mb-4">Order Details</h3>
       <div className="grid grid-cols-3 gap-4 mb-6">
         <div>
           <label className="block mb-2 font-semibold">Order Number</label>
           <input
             type="text"
             name="orderNumber"
             value={formData.orderNumber}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter order number"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Order Date</label>
           <input
             type="date"
             name="orderDate"
             value={formData.orderDate}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Shipping Method</label>
           <input
             type="text"
             name="shippingMethod"
             value={formData.shippingMethod}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter shipping method"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Delivery Date</label>
           <input
             type="date"
             name="deliveryDate"
             value={formData.deliveryDate}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
           />
         </div>
       </div>

       {/* Items Information */}

       <h3 className="text-lg font-semibold mb-4">Items</h3>
       <div className="grid grid-cols-2 gap-4 mb-6">
         {items.map((item, index) => (
           <div key={index} className="flex items-center space-x-4 mb-2 bg-gray-100 rounded-lg p-3">
             <div className="flex-1">
               <label className="block mb-1 font-semibold">Item</label>
               <select
                 name="itemName"
                 value={item.itemName}  // <-- binds selected value
                 onChange={(e) => handleItemChange(index, e)}
                 className="border px-4 py-2 w-[140px] rounded"
               >
                 <option selected>Select Item</option>  {/* Placeholder */}
                 {itemOptions.map((option, i) => (
                   <option key={i} value={option.label}>
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>

             

             <div>
               <label className="block mb-1 font-semibold">Quantity</label>
               <input
                 type="number"
                 name="quantity"
                 value={item.quantity}
                 onChange={(e) => handleQuantityChange(index, e)}
                 className="border px-4 py-2 w-full rounded"
               />
             </div>

             <div>
               <label className="block mb-1 font-semibold">Price</label>
               <input
                 type="text"
                 value={item.price}
                 readOnly
                 className="border px-4 py-2 w-full rounded bg-gray-200"
               />
             </div>

             <button
               type="button"
               onClick={() => removeItem(index)}
               className="text-red-600 font-semibold"
             >
               Remove
             </button>
           </div>
         ))}
         <button
           type="button"
           onClick={addItem}
           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
         >
           Add Another Item
         </button>
       </div>
       
       {/* Invoice Details */}
       <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
       <div className="grid grid-cols-3 gap-4 mb-6">
         <div>
           <label className="block mb-2 font-semibold">Invoice Date</label>
           <input
             type="date"
             name="invoiceDate"
             value={formData.invoiceDate}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Due Date</label>
           <input
             type="date"
             name="dueDate"
             value={formData.dueDate}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Subtotal</label>
           <input
             type="text"
             value={formData.subtotal}
             readOnly
             className="border px-4 py-2 w-full rounded bg-gray-200"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Discounts</label>
           <input
             type="number"
             name="discounts"
             value={formData.discounts}
             onChange={handleChange}
             className="border px-4 py-2 w-full rounded"
             placeholder="Enter discounts"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Total Amount</label>
           <input
             type="text"
             value={formData.totalAmount}
             readOnly
             className="border px-4 py-2 w-full rounded bg-gray-200"
           />
         </div>
       </div>

       {/* Additional Information */}
       <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
       <div className="grid grid-cols-2 gap-4 mb-6">
         <div>
           <label className="block mb-2 font-semibold">Terms and Conditions</label>
           <textarea
             name="terms"
             value={formData.terms}
             onChange={handleChange}
             className="border px-4 py-2 h-[120px] w-full rounded"
             placeholder="Enter terms and conditions"
           />
         </div>
         <div>
           <label className="block mb-2 font-semibold">Notes</label>
           <textarea
             name="notes"
             value={formData.notes}
             onChange={handleChange}
             className="border px-4 py-2 h-[120px] w-full rounded"
             placeholder="Enter additional notes"
           />
         </div>
       </div>

       {/* Submit Button */}
       <div className="text-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Submit Invoice
          </button>
        </div>
     </form>
   </div>
         </div>
         <form method="dialog" className="modal-backdrop">
 <button>close</button>
       </form>
   </dialog>
 
   </>
  );

    
}



export default CreateInvoice;
