import React, { useState } from 'react';

function CreateInvoice() {
  // State for form fields
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
    subtotal: '',
    taxes: '',
    discounts: '',
    totalAmount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic (e.g., send data to a server)
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-6">Create Invoice</h2>

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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

          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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

          {/* Invoice Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-semibold">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
                placeholder="Enter invoice number"
              />
            </div>

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
              <label className="block mb-2 font-semibold">Payment Terms</label>
              <input
                type="text"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
                placeholder="Enter payment terms"
              />
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-semibold">Subtotal</label>
              <input
                type="number"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
                placeholder="Enter subtotal"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Taxes</label>
              <input
                type="number"
                name="taxes"
                value={formData.taxes}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
                placeholder="Enter taxes"
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
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
                placeholder="Enter total amount"
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
  );
}

export default CreateInvoice;
