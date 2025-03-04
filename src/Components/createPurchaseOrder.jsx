import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { toPng } from "html-to-image";
import { IoCreateOutline } from "react-icons/io5";
import InvoiceDownload from './invoiceDownload';
import { useSocket } from '../context/SocketContext';
import { ToastContainer, toast } from 'react-toastify';

function createPurchaseOrder({ userData }) {
  const [isPreview, setIsPreview] = useState(false); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState([{ itemName: '', quantity: 1, price: 0 }]);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([])
  const [selectedRowData, setSelectedRowData] = useState([])

  const defaultTerms = `These are the terms and conditions:
  - All purchases are final.
  - No refunds after 30 days.
  - Users must agree to the privacy policy.
  `;
  
  const invoiceRef = useRef(null);

  const itemOptions = [
    { label: 'JJM Calamansi Dishwashing Liquid', value: 'soap_a', price: 28 },
    { label: 'JJM Lemon Dishwashing Liquid', value: 'soap_b', price: 25 },
    { label: 'JJM Antibac Fabric Conditioner', value: 'soap_c', price: 35 },
    { label: 'JJM Calamansi Dishwashing Past', value: 'soap_d', price: 55 },
  ];
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerContact: 0,
    customerId: '',
    orderNumber: '',
    orderDate: '',
    shippingMethod: '',
    deliveryDate: '',
    paymentMethod: '',
    items: [{ itemName: '', quantity: 1, price: 0 }],
    invoiceDate: '',
    dueDate: '',
    subtotal: 0,
    discounts: 0,
    totalAmount: 0,
    terms: defaultTerms,
    notes: '',
  });

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const socket = useSocket();

  const columns = [
    { name: 'Order Number', selector: row => row.orderNumber },
    { name: 'Customer ID', selector: row => row.customerId },
    { name: 'Customer Name', selector: row => row.customerName },
    { name: 'Customer Address', selector: row => row.customerAddress },
    { name: 'Orders', selector: row => (
      <ul>
        {row.orders.map((item, index) => (
      <li key={index}>[Product: {item.itemName} Quantity: {item.quantity} Price: {item.price}]</li>
    ))}
      </ul>
    ) },
    { name: 'Contact Information', selector: row => row.contactInformation },
    { name: 'Order Date', selector: row => row.orderDate },
    { name: 'Delivery Date', selector: row => row.deliveryDate },
    { name: 'Shipping Method', selector: row => row.shippingMethod },
    { name: 'Payment Method', selector: row => row.paymentMethod },
    {
      name: 'Create Purchase Order',
      selector: row => (
        <a className="text-4xl">
          <IoCreateOutline
            className="hover:cursor-pointer"
            onClick={() => {document.getElementById('invoice_modal').showModal()
            setFormData((prevData) => ({
              ...prevData,
              customerAddress: row.customerAddress,
              customerName: row.customerName,
              customerId: row.customerId,
              orderNumber: row.orderNumber,
              customerContact: row.contactInformation,
              orderDate: row.orderDate,
              shippingMethod: row.shippingMethod,
              paymentMethod: row.paymentMethod,
              deliveryDate: row.deliveryDate,
              items: row.orders.map(order => ({
                itemName: order.itemName,
                quantity: order.quantity,
                price: order.price
              }))
            }))
          }}
          />
        </a>
      ),
    },
  ];
  

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );


  useEffect(() => {
    calculateTotal();
  }, [formData.items, formData.taxes, formData.discounts]);

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity; 
      return total + itemTotal;
    }, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    const selectedItem = itemOptions.find(option => option.label === value);

    console.log("Selected Item:", selectedItem);

    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
      price: selectedItem ? selectedItem.price : 0,
    };
    const totalAmount = calculateTotalAmount(updatedItems);
    setFormData({ ...formData, items: updatedItems, totalAmount });
  };
  
  const handleQuantityChange = (index, e) => {
    const { value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = Number(value);
    
    console.log("Updated Quantity:", updatedItems[index].quantity);
  
    const totalAmount = calculateTotalAmount(updatedItems);
    setFormData({ ...formData, items: updatedItems, totalAmount });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: 'NONE', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };


  const validateForm = () => {
    const {
      items,
      invoiceDate,
      dueDate,
    } = formData;
  
    if (
      !invoiceDate ||
      !dueDate
    ) {
      return false;
    }
  
  
    if (
      items.length === 0 ||
      items.some(item => !item.itemName || item.quantity <= 0 || item.price <= 0)
    ) {
      return false;
    }
  
    return true;
  };

  const handleViewPreview = () => {
    console.log(formData)
    if (validateForm()) {
      document.getElementById('preview_modal').showModal();
    } else {
      toast.error("Please fill out all required fields before viewing the preview.", {
        position: "top-center",
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce(
      (total, item) => total + (item.price * item.quantity || 0), 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateItems()) {
      toast.error("Please select a valid item for all fields before submitting.", {
        position: "top-center"
      });
      return;
    }
    setIsPreview(true);
  };

  const confirmSubmission = () => {
    socket.emit("create_invoice", formData);
    setIsLoading(true);
  };

  // RESPONSE FROM SUBMITTED INVOICE RECORD
  useEffect(() => {
    socket.emit("get_orders")

    socket.on("response_create_invoice", (response) => {
      setResponseData(response);
      setIsSubmitted(true); 
      setIsPreview(false);
      setIsLoading(false);

      socket.on("trails_error", (response) => {
        console.error(response);
      });

      const invoiceTrails = {
        userId: userData._id,
        userName: userData.userName,
        role: userData.role,
        action: "CREATED AN P.ORDER",
        description: `Created an P.Order for ${response.customerName}. P.Order ID ${response._id}`,
      };

      socket.emit("addAuditTrails", invoiceTrails);
    });


    // HANDLE GET ORDERS
    const getOrders = (response) => {
      setData(response)
    }

    socket.on("invoice_error", (response) => {
      setIsPreview(false);
      setIsLoading(false);
      toast.error(response.message, {
        position: "top-right",
      });
    });

    socket.on("receive_orders", getOrders)

    return () => {
      socket.off("response_create_invoice");
      socket.off("trails_error");
      socket.off("receive_orders");
      socket.off("invoice_error");
    };
  }, [socket, userData]);

  const callBackFunction = (newValue) => {
    setIsSubmitted(newValue);
  };

  // INVOICE DOWNLOAD COMPONENT
  if (isSubmitted) {
    return <InvoiceDownload invoiceData={responseData} isSubmitted={callBackFunction} />;
  }

  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-4">
        <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
          <div className="mx-4">
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Purchase Order Creation"
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

      <dialog id="invoice_modal" className="modal">
        <ToastContainer />
        <div className="modal-box w-full max-w-7xl">
          <div ref={invoiceRef} className="invoice-container bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-center text-2xl font-bold mb-6">Generate Purchase Order</h2>

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
                    readOnly
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
                    readOnly
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Contact Information</label>
                  <input
                    type="number"
                    name="customerContact"
                    value={formData.customerContact}
                    onChange={handleChange}
                    className="border px-4 py-2 w-full rounded"
                    placeholder="Enter contact info"
                    readOnly
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
                    readOnly
                  />
                </div>
              </div>

              {/* Order Details */}
              <h3 className="text-lg font-semibold mb-4">Order Information</h3>
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
                    readOnly
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
                    readOnly
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
                    readOnly
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Payment Method</label>
                  <input
                    type="text"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="border px-4 py-2 w-full rounded"
                    readOnly
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
                    readOnly
                  />
                </div>
              </div>

              {/* Items Information */}
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2 bg-gray-100 rounded-lg p-3">
                    <div className="flex-1">
                      <label className="block mb-1 font-semibold">Item</label>
                      <input
                        type="text"
                        name="itemName"
                        value={item.itemName}
                        readOnly
                        className="border px-4 py-2 w-[200px] rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-semibold">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        readOnly
                        className="border px-4 py-2 w-full rounded"
                        min="1"
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
                  </div>
                ))}
              </div>

              {/* Invoice Details */}
              <h3 className="text-lg font-semibold mb-4">Purchase Order Details</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block mb-2 font-semibold">P. Order Date</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    className="border px-4 py-2 w-full rounded"
                    required
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
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Subtotal</label>
                  <input
                    type="number"
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
                    type="number"
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
                  type="button"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  onClick={handleViewPreview}
                >
                  View Preview
                </button>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Modal for confirming invoice details */}
      <dialog id="preview_modal" className="modal">
        <div className="modal-box w-full h-full max-w-[1000px]">
          <div className="invoice-container bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Order</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <p><strong>Name:</strong> {formData.customerName}</p>
              <p><strong>Address:</strong> {formData.customerAddress}</p>
              <p><strong>Contact:</strong> {formData.customerContact}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Order Information</h3>
              <p><strong>Order Number:</strong> {formData.orderNumber}</p>
              <p><strong>Order Date:</strong> {formData.orderDate}</p>
              <p><strong>Shipping Method:</strong> {formData.shippingMethod}</p>
              <p><strong>Payment Method:</strong> {formData.paymentMethod}</p>
              <p><strong>Delivery Date:</strong> {formData.deliveryDate}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <p><strong>Terms and Conditions:</strong> {formData.terms}</p>
              <p><strong>Notes:</strong> {formData.notes}</p>
            </div>
            <div className="mt-10">
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">DESCRIPTION</th>
                    <th className="py-2 text-right">UNIT PRICE</th>
                    <th className="py-2 text-right">QTY</th>
                    <th className="py-2 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items && formData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.itemName}</td>
                      <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal, Discounts, and Total */}
            <div className="mt-8">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-right">
                  <p><strong>SUBTOTAL:</strong></p>
                  <p><strong>DISCOUNTS:</strong></p>
                </div>
                <div className="text-right">
                  <p>{formatCurrency(formData.subtotal || 0)}</p>
                  <p>{formatCurrency(formData.discounts || 0)}</p>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 my-2"></div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-right">
                  <p className="text-lg font-bold"><strong>TOTAL AMOUNT:</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatCurrency(formData.totalAmount || 0)}</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              {!isLoading && (
                <button
                  type="button"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  onClick={confirmSubmission}
                >
                  Submit Purchase Order
                </button>
              )}
              {isLoading && (
                <button
                  type="button"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  <span className="loading loading-spinner loading-md"></span>
                </button>
              )}
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default createPurchaseOrder;
