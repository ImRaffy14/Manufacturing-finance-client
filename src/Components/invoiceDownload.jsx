import React, { useRef } from 'react';
import logo from '../assets/JJM.jfif';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

function InvoiceDownload({ invoiceData, isSubmitted }) {
  const invoiceRef = useRef(null);

  const handleGeneratePdf = async () => {
    const inputData = invoiceRef.current;
    try {
      const canvas = await html2canvas(inputData);
      const imgData = canvas.toDataURL("image/png");

      const customWidth = 500;  
      const customHeight =520; 

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [customWidth, customHeight],
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${invoiceData.customerName} ${invoiceData._id}`);
      isSubmitted(false)
    } catch (error) {
      console.log(error);
    }
  };

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="container mx-auto p-4">
      {/* INVOICE REFERENCE */}
      <div ref={invoiceRef} style={{ backgroundColor: 'white', padding: '20px', margin: '0 auto', width: '800px', border: '1px solid gray' }}>
        {/* Logo and Invoice Title */}
        <div className="flex justify-between items-center mb-4">
          <img src={logo} alt="Company Logo" className="w-32 h-auto" />
          <h1 className="text-4xl font-bold tracking-wide text-right">PURCHASE ORDER</h1>
        </div>

        {/* CUSTOMER INFO */}
        <div className="flex justify-between mt-10">
          <div className="text-left">
            <p><strong>ISSUED TO:</strong></p>
            <p>{invoiceData.customerName || 'Customer Name'}</p>
            <p>{invoiceData.customerAddress || 'Customer Address'}</p>
            <p>{invoiceData.customerContact || 'Customer Contact'}</p>
          </div>

          <div className="text-right">
            <p><strong>P. ORDER ID:</strong> {invoiceData._id || '01234'}</p>
            <p><strong>DATE:</strong> {invoiceData.invoiceDate || '11.02.2030'}</p>
            <p><strong>DUE DATE:</strong> {invoiceData.dueDate || '11.03.2030'}</p>
          </div>
        </div>

        {/* SHIPPING AND PAYMENT INFORMATION */}
        <div className="mt-8">
          <p><strong>PAY TO:</strong></p>
          <p>Shipping Method: {invoiceData.shippingMethod || 'Standard Shipping'}</p>
          <p>Payment Method: {invoiceData.paymentMethod || 'COD'}</p>
          <p>Delivery Date: {invoiceData.deliveryDate || '11.04.2030'}</p>
        </div>

        {/* ORDER DETAILS */}
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

        {/* TOTALS */}
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right">
              <p><strong>SUBTOTAL:</strong></p>
              <p><strong>DISCOUNTS:</strong></p>
            </div>
            <div className="text-right">
              <p>{formatCurrency(invoiceData.subTotal || 0)}</p>
              <p>{formatCurrency(invoiceData.discounts || 0)}</p>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 my-2"></div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-right">
              <p className="text-lg font-bold"><strong>TOTAL AMOUNT:</strong></p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(invoiceData.totalAmount || 0)}</p>
            </div>
          </div>
        </div>

        {/* TERMS ANND NOTES */}
        <div className="mt-10">
          <p><strong>TERMS AND CONDITIONS:</strong></p>
          <p>{invoiceData.terms || 'Default terms and conditions.'}</p>
        </div>

        <div className="mt-4">
          <p><strong>NOTES:</strong></p>
          <p>{invoiceData.notes || 'Additional notes.'}</p>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="text-center mt-6">
        <button
          onClick={handleGeneratePdf}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Download P. Order as PDF
        </button>
      </div>
    </div>
  );
}

export default InvoiceDownload;
