import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

function invoiceDownload({ invoiceData }) {
  const invoiceRef = useRef(null);

  // Function to handle downloading the image
  const downloadImage = () => {
    if (invoiceRef.current === null) {
      return;
    }

    toPng(invoiceRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'invoice.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Invoice layout */}
      <div ref={invoiceRef} className="border p-4 rounded bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Invoice</h2>

        <div className="max-w-4xl mx-auto border border-gray-200 p-8">
      <div className="text-right">
        <h1 className="text-4xl font-bold tracking-wide">INVOICE</h1>
      </div>

      {/* Customer Information */}
      <div className="flex justify-between mt-10">
        <div className="text-left">
          <p><strong>ISSUED TO:</strong></p>
          <p>{invoiceData.customerName || 'Customer Name'}</p>
          <p>{invoiceData.customerAddress || 'Customer Address'}</p>
          <p>{invoiceData.customerContact || 'Customer Contact'}</p>
        </div>

        <div className="text-right">
          <p><strong>INVOICE ID:</strong> {invoiceData._id || '01234'}</p>
          <p><strong>DATE:</strong> {invoiceData.invoiceDate || '11.02.2030'}</p>
          <p><strong>DUE DATE:</strong> {invoiceData.dueDate || '11.03.2030'}</p>
        </div>
      </div>

      {/* Shipping and Payment Information */}
      <div className="mt-8">
        <p><strong>PAY TO:</strong></p>
        <p>Shipping Method: {invoiceData.shippingMethod || 'Standard Shipping'}</p>
        <p>Delivery Date: {invoiceData.deliveryDate || '11.04.2030'}</p>
      </div>

      {/* Order Details Table */}
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
  {invoiceData.items && invoiceData.items.map((item, index) => (
    <tr key={index} className="border-b">
      <td className="py-2">{item.itemName}</td> 
      <td className="py-2 text-right">${item.price.toFixed(2)}</td> 
      <td className="py-2 text-right">{item.quantity}</td>
      <td className="py-2 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Subtotal, Discounts, and Total */}
      <div className="mt-8 text-right">
        <p><strong>SUBTOTAL:</strong> ${invoiceData.subTotal || '0'}</p>
        <p><strong>DISCOUNTS:</strong> ${invoiceData.discounts || '0'}</p>
        <p><strong>TOTAL AMOUNT:</strong> ${invoiceData.totalAmount || '0'}</p>
      </div>

      {/* Terms and Notes */}
      <div className="mt-10">
        <p><strong>TERMS AND CONDITIONS:</strong></p>
        <p>{invoiceData.terms || 'Default terms and conditions.'}</p>
      </div>

      <div className="mt-4">
        <p><strong>NOTES:</strong></p>
        <p>{invoiceData.notes || 'Additional notes.'}</p>
      </div>
      </div>
      </div>
      {/* Button to download the invoice as an image */}
      <div className="text-center mt-6">
        <button
          onClick={downloadImage}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Download Invoice as Image
        </button>
      </div>
    </div>
  );
}

export default invoiceDownload;