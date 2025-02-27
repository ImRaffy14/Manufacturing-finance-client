import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';   
import { jsPDF } from 'jspdf';
import JJM from '../assets/JJM.jfif';
import html2canvas from 'html2canvas-pro';
import { useSocket } from '../context/SocketContext';

const viewFinancialReports = ({userData}) => {
  const [preparedBy, setPreparedBy] = useState('Financial Management');
  const [position, setPosition] = useState('Finance Manager');
  const [currentDate, setCurrentDate] = useState('');
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation();
  const { rowData } = location.state || {};
  const socket = useSocket()
  
  if (!rowData) {
    return <p>No data available.</p>;
  }

  //SOCKET CONNECTION
  useEffect(() => {
    if (!socket || !rowData?._id) return;
  
    socket.emit('get_specific_financial_report', rowData._id);
  
    const handleSpecificFinancialReport = (response) => {
      setIsLoading(false)
      setReportData(response);
    };
  
    socket.on('receive_specific_financial_report', handleSpecificFinancialReport);
  
    return () => {
      socket.off('receive_specific_financial_report', handleSpecificFinancialReport);
    };
  }, [socket, rowData?._id]);
  


  useEffect(() => {
    const date = new Date(rowData.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric', 
    });
    setCurrentDate(formattedDate);
    
  }, []);

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const exportToPDF = async () => {
    const exportBtn = document.getElementById('export-button');
    exportBtn.style.display = 'none';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const sections = [
        document.getElementById('report-header-and-narrative-balance-sheet'),
        document.getElementById('income-statement-and-cash-flow'),
    ];

    const captureSection = async (section, isLastSection) => {
        if (!section) return;

        const canvas = await html2canvas(section, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        let imgWidth = 210; 
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let pageHeight = 297;
        let yPosition = 10; 

        while (imgHeight > 0) {
            pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, Math.min(imgHeight, pageHeight - yPosition));
            imgHeight -= pageHeight - yPosition;
            if (imgHeight > 0) pdf.addPage(); 
            yPosition = 10; 
        }

        if (!isLastSection && imgHeight > 0) pdf.addPage();
    };

    for (let i = 0; i < sections.length; i++) {
        await captureSection(sections[i], i === sections.length - 1);
    }

    pdf.save(`${currentDate}-financial-report.pdf`);
    exportBtn.style.display = 'block';
  };
  
  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="skeleton h-[520px] w-full"></div>
        <div className="skeleton h-20 w-full"></div>
        <div className="skeleton h-20 w-full"></div>
        <div className="skeleton h-20 w-full"></div>
      </div>
    );
  }

  return (
    <>      
      <div className="max-w-screen-2xl mx-auto mt-8 mb-10">
        <div className="breadcrumbs text-xl mt-4">
          <ul>
            <li><Link to="/Dashboard/financialReports">Return</Link></li>
            <li><span className='text-blue-500 underline'>Documents</span></li>  
          </ul>
        </div>
        <div className="p-4 md:p-10">
          <div className="bg-white  rounded-lg p-4 md:p-10">
            <div
              id="financial-report"
              style={{
                padding: '20px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
              }}
            >
              <section id="report-header-and-narrative-balance-sheet" className="max-w-screen-md mx-auto p-4 md:p-10 bg-white rounded-lg">
                {/* Header */}
                <header className="text-center mb-8">
                  <div className="flex items-center justify-center w-full mb-4">
                    <img src={JJM} className="h-20 w-20" alt="Logo" />
                  </div>
                  <h2 className="text-xl md:text-2xl">Financial Report ID {rowData._id}</h2>
                  <p className="mt-2">Prepared by: {preparedBy}</p>
                  <p>Date: {rowData.date}</p>
                </header>

                {/* NARRATIVE REPORT */}
                <section id="narrative" className="text-sm md:text-base">
                  <h2 className="text-lg md:text-xl font-semibold">Narrative Report</h2>
                  <p className="mt-2">
                    {reportData.narrativeReport}
                  </p>
                </section>

              {/* BALANCE SHEET */}
              <section id="balance-sheet" className="mt-10">
                <h2 className="text-lg md:text-xl font-semibold text-center">BALANCE SHEET</h2>
                <h3 className="text-md md:text-lg font-semibold text-center">SEPTEMBER</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border mt-4">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-4 py-2 text-left">ASSETS</th>
                        <th className="border px-4 py-2 text-left">LIABILITIES</th>
                        <th className="border px-4 py-2 text-left">EQUITY</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Cash – {formatCurrency(reportData.cash)}</td>
                        <td className="border px-4 py-2">Accounts Payable – {formatCurrency(reportData.accountsPayable)}</td>
                        <td className="border px-4 py-2">Owner’s Equity – {formatCurrency(reportData.ownersEquity)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Inventory (unsold Product) – {formatCurrency(reportData.inventory)}</td>
                        <td className="border px-4 py-2">Total Liabilities – {formatCurrency(reportData.totalLiabilities)}</td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Accounts Receivable – {formatCurrency(reportData.accountsReceivable)}</td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Total Assets – {formatCurrency(reportData.totalAssets)}</td>
                        <td className="border px-4 py-2 font-bold">Total Liabilities – {formatCurrency(reportData.totalLiabilities)}</td>
                        <td className="border px-4 py-2 font-bold">Total Equity – {formatCurrency(reportData.totalEquity)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold"></td>
                        <td className="border px-4 py-2 font-bold" colSpan="2">Total Liabilities and Equity – {formatCurrency(rowData.totalLiabilitiesAndEquity)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </section>

            {/* INCOME STATEMENT AND CASH FLOW */}
            <section id="income-statement-and-cash-flow" className="max-w-screen-md mx-auto p-4 md:p-10 bg-white rounded-lg">
              {/* INCOME STATEMENT */}
              <section id="income-statement">
                <h2 className="text-lg md:text-xl font-semibold text-center">INCOME STATEMENT</h2>
                <h3 className="text-md md:text-lg font-semibold text-center">SEPTEMBER</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border mt-4">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-4 py-2 text-left">REVENUE</th>
                        <th className="border px-4 py-2 text-left">COST OF GOODS SOLD</th>
                        <th className="border px-4 py-2 text-left">OPERATING EXPENSES</th>
                        <th className="border px-4 py-2 text-left">NET PROFITS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Sales Revenue – {formatCurrency(reportData.salesRevenue)}</td>
                        <td className="border px-4 py-2">Raw Materials – {formatCurrency(reportData.rawMaterials)}</td>
                        <td className="border px-4 py-2">Salaries and Wages – {formatCurrency(reportData.salariesAndWages)}</td>
                        <td className="border px-4 py-2">Gross Profit – {formatCurrency(reportData.grossProfit)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2">Labor Costs – {formatCurrency(reportData.laborCosts)}</td>
                        <td className="border px-4 py-2">Utilities – {formatCurrency(reportData.utilities)}</td>
                        <td className="border px-4 py-2">Operating Expenses – {formatCurrency(reportData.totalOperatingExpenses)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2">Employee Expenses – {formatCurrency(reportData.employeeExpenses)}</td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Total Revenue – {formatCurrency(reportData.totalRevenue)}</td>
                        <td className="border px-4 py-2 font-bold">Total COGS – {formatCurrency(reportData.totalCogs)}</td>
                        <td className="border px-4 py-2 font-bold">Total Operating Expenses – {formatCurrency(reportData.totalOperatingExpenses)}</td>
                        <td className="border px-4 py-2 font-bold">Net Income – {formatCurrency(rowData.netIncome)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* CASH FLOW */}
              <section id="cash-flow" className="mt-10">
                <h2 className="text-lg md:text-xl font-semibold text-center">CASH FLOW</h2>
                <h3 className="text-md md:text-lg font-semibold text-center">SEPTEMBER</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border mt-4">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-4 py-2 text-left">CASH INFLOWS</th>
                        <th className="border px-4 py-2 text-left">CASH OUTFLOWS (Operating Activities)</th>
                        <th className="border px-4 py-2 text-left">CASH OUTFLOWS (Investing Activities)</th>
                        <th className="border px-4 py-2 text-left">TOTAL CASH FLOW</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">Customer Payments – {formatCurrency(reportData.customerPayments)}</td>
                        <td className="border px-4 py-2">Payments to Supplier – {formatCurrency(reportData.paymentToSupplier)}</td>
                        <td className="border px-4 py-2">Purchase of New Equipment – {formatCurrency(reportData.purchaseOfNewEquipments)}</td>
                        <td className="border px-4 py-2">Net Cash Flow – {formatCurrency(reportData.netCashFlow)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Sale of Old Equipment – {formatCurrency(reportData.saleOfOldEquipment)}</td>
                        <td className="border px-4 py-2">Salaries and Wages – {formatCurrency(reportData.salariesAndWages)}</td>
                        <td className="border px-4 py-2">Utilities – {formatCurrency(reportData.utilities)}</td>
                        <td className="border px-4 py-2">Beginning Balance – {formatCurrency(reportData.beginningBalance)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Total Inflows – {formatCurrency(reportData.totalInflows)}</td>
                        <td className="border px-4 py-2 font-bold">Total Outflows – {formatCurrency(reportData.totalOutflowsO)}</td>
                        <td className="border px-4 py-2 font-bold">Total Outflows – {formatCurrency(reportData.totalOutflowsI)}</td>
                        <td className="border px-4 py-2 font-bold">Ending Balance – {formatCurrency(reportData.endingBalance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </section>

            {/* EXPORT BUTTON */}
            <div id="export-button" className="text-center mt-20">
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default viewFinancialReports;
