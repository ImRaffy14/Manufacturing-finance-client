import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Invoice({ formData, items }) {
  const invoiceRef = useRef(null);

  const handleGeneratePdf = async () => {
    const inputData = invoiceRef.current;
    try {
      const canvas = await html2canvas(inputData);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('Invoice.pdf');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div ref={invoiceRef} className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Invoice</h2>

        {/* Customer Information */}
        <div>
          <p><strong>Customer Name:</strong> {formData.customerName}</p>
          <p><strong>Customer Address:</strong> {formData.customerAddress}</p>
          <p><strong>Contact Information:</strong> {formData.customerContact}</p>
          <p><strong>Customer ID:</strong> {formData.customerId}</p>
        </div>

        {/* Order Details */}
        <h3 className="mt-6 text-lg font-semibold">Order Details</h3>
        <div>
          <p><strong>Order Number:</strong> {formData.orderNumber}</p>
          <p><strong>Order Date:</strong> {formData.orderDate}</p>
          <p><strong>Shipping Method:</strong> {formData.shippingMethod}</p>
          <p><strong>Delivery Date:</strong> {formData.deliveryDate}</p>
        </div>

        {/* Items Information */}
        <h3 className="mt-6 text-lg font-semibold">Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <p><strong>Item:</strong> {item.itemName}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> {item.price}</p>
          </div>
        ))}

        {/* Invoice Details */}
        <h3 className="mt-6 text-lg font-semibold">Invoice Details</h3>
        <div>
          <p><strong>Invoice Date:</strong> {formData.invoiceDate}</p>
          <p><strong>Due Date:</strong> {formData.dueDate}</p>
          <p><strong>Subtotal:</strong> {formData.subtotal}</p>
          <p><strong>Discounts:</strong> {formData.discounts}</p>
          <p><strong>Total Amount:</strong> {formData.totalAmount}</p>
        </div>

        {/* Additional Information */}
        <h3 className="mt-6 text-lg font-semibold">Additional Information</h3>
        <div>
          <p><strong>Terms and Conditions:</strong> {formData.terms}</p>
          <p><strong>Notes:</strong> {formData.notes}</p>
        </div>
      </div>

      {/* Button to generate PDF */}
      <div className="text-center mt-6">
        <button
          onClick={handleGeneratePdf}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Download Invoice as PDF
        </button>
      </div>
    </div>
  );
}

export default Invoice;
