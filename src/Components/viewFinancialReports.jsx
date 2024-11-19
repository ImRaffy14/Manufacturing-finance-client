import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';   
import { jsPDF } from 'jspdf';
import JJM from '../assets/JJM.jfif';
import html2canvas from 'html2canvas-pro';

const viewFinancialReports = ({userData}) => {
  const [preparedBy, setPreparedBy] = useState('Financial Management');
  const [position, setPosition] = useState('Finance Manager');
  const [currentDate, setCurrentDate] = useState('');
  const location = useLocation();
  const { rowData } = location.state || {};
  
  if (!rowData) {
    return <p>No data available.</p>;
  }

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const incomeStatementData = [
    {
      salesRevenue: 123123,
      rawMaterials: 123213,
      laborCosts: 123123,
      salariesAndWages: 123213,
      utilities: 123131,
      grossProfit: 121321,
      operatingExpenses: 1232113,
      employeeExpenses: 123131,
      totalRevenue: 2222222,
      totalCOGS: 22222213,
      totalOperatingExpenses: 1231231,
    },
  ];

  const cashFlowData = [
    {
      customerPayments: 12321312,
      paymentsToSupplier: 12313123,
      saleOfOldEquipment: 12311,
      salariesAndWages: 12321313,
      utilities: 123131,
      totalInflows: 123213123,
      totalOutflowsOperating: 1231321312,
      totalOutflowsInvesting: 1232131231,
      netCashFlow: 1211222,
      beginningBalance: 123123,
      purchaseOfNewEquipment: 123123,
    },
  ];

  const balanceSheetData = [
    {
      cash: 143122,
      inventory: 123123,
      accountsReceivable: 123123,
      accountsPayable: 123123,
      ownersEquity: 123123,
      retainedEarnings: 123123,
      totalLiabilities: 123123,
      totalAssets: 123123,
      totalEquity: 123123,
    },
  ];

  const exportToPDF = () => {
    const exportBtn = document.getElementById('export-button');
    exportBtn.style.display = 'none';
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const sections = [
      document.getElementById('report-header-and-narrative-balance-sheet'), // PAGE 1
      document.getElementById('income-statement-and-cash-flow'),            // PAGE 2
    ];
  
    const captureSection = (section, isLastSection, callback) => {
      if (!section) {
        console.error('Invalid section element. Skipping this section.');
        callback();
        return;
      }
  
      html2canvas(section, { scale: 3, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
        if (!isLastSection) pdf.addPage();
  
        callback();
      }).catch((error) => {
        console.error('Error capturing section:', error);
        callback();
      });
    };
  
    const processSections = (index) => {
      const isLastSection = index === sections.length - 1;
      if (index < sections.length) {
        captureSection(sections[index], isLastSection, () => processSections(index + 1));
      } else {
        pdf.save('financial-report.pdf');
        exportBtn.style.display = 'block';
      }
    };
  
    processSections(0);
  };
  
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
                  <h2 className="text-lg md:text-xl font-semibold">1. Narrative Report</h2>
                  <p className="mt-2">
                    For the period ended {currentDate}, the financial performance reflects a stable revenue stream. Total sales revenue reached {formatCurrency(incomeStatementData[0].salesRevenue)}, with a gross profit of {formatCurrency(incomeStatementData[0].grossProfit)}.
                  </p>
                  <p className="mt-2">
                    The cost of goods sold (COGS) was {formatCurrency(parseFloat(incomeStatementData[0].rawMaterials) + parseFloat(incomeStatementData[0].laborCosts))}, constituting approximately {(parseFloat(incomeStatementData[0].grossProfit) / parseFloat(incomeStatementData[0].salesRevenue) * 100).toFixed(2)}% of total revenue.
                  </p>
                  <p className="mt-2">
                    Operating expenses totaled {formatCurrency(parseFloat(incomeStatementData[0].salariesAndWages) + parseFloat(incomeStatementData[0].utilities))}, which affected the overall profitability. The net profit for the period stands at {formatCurrency(incomeStatementData[0].operatingExpenses)}.
                  </p>
                  <p className="mt-2">
                    The outlook remains positive, with a healthy cash flow of {formatCurrency(cashFlowData[0].netCashFlow)} and strong asset management, positioning the company for future growth.
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
                        <td className="border px-4 py-2">Cash – {formatCurrency(balanceSheetData[0].cash)}</td>
                        <td className="border px-4 py-2">Accounts Payable – {formatCurrency(balanceSheetData[0].accountsPayable)}</td>
                        <td className="border px-4 py-2">Owner’s Equity – {formatCurrency(balanceSheetData[0].ownersEquity)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Inventory (unsold Product) – {formatCurrency(balanceSheetData[0].inventory)}</td>
                        <td className="border px-4 py-2">Total Liabilities – {formatCurrency(balanceSheetData[0].totalLiabilities)}</td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Accounts Receivable – {formatCurrency(balanceSheetData[0].accountsReceivable)}</td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Total Assets – {formatCurrency(balanceSheetData[0].totalAssets)}</td>
                        <td className="border px-4 py-2 font-bold">Total Liabilities – {formatCurrency(balanceSheetData[0].totalLiabilities)}</td>
                        <td className="border px-4 py-2 font-bold">Total Equity – {formatCurrency(balanceSheetData[0].totalEquity)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold"></td>
                        <td className="border px-4 py-2 font-bold" colSpan="2">Total Liabilities and Equity – {formatCurrency(rowData.liabilitiesAndEquity)}</td>
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
                        <td className="border px-4 py-2">Sales Revenue – {formatCurrency(incomeStatementData[0].salesRevenue)}</td>
                        <td className="border px-4 py-2">Raw Materials – {formatCurrency(incomeStatementData[0].rawMaterials)}</td>
                        <td className="border px-4 py-2">Salaries and Wages – {formatCurrency(incomeStatementData[0].salariesAndWages)}</td>
                        <td className="border px-4 py-2">Gross Profit – {formatCurrency(incomeStatementData[0].grossProfit)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2">Labor Costs – {formatCurrency(incomeStatementData[0].laborCosts)}</td>
                        <td className="border px-4 py-2">Utilities – {formatCurrency(incomeStatementData[0].utilities)}</td>
                        <td className="border px-4 py-2">Operating Expenses – {formatCurrency(incomeStatementData[0].operatingExpenses)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2">Employee Expenses – {formatCurrency(incomeStatementData[0].employeeExpenses)}</td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Total Revenue – {formatCurrency(incomeStatementData[0].totalRevenue)}</td>
                        <td className="border px-4 py-2 font-bold">Total COGS – {formatCurrency(incomeStatementData[0].totalCOGS)}</td>
                        <td className="border px-4 py-2 font-bold">Total Operating Expenses – {formatCurrency(incomeStatementData[0].totalOperatingExpenses)}</td>
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
                        <td className="border px-4 py-2">Customer Payments – {formatCurrency(cashFlowData[0].customerPayments)}</td>
                        <td className="border px-4 py-2">Payments to Supplier – {formatCurrency(cashFlowData[0].paymentsToSupplier)}</td>
                        <td className="border px-4 py-2">Purchase of New Equipment – {formatCurrency(cashFlowData[0].purchaseOfNewEquipment)}</td>
                        <td className="border px-4 py-2">Net Cash Flow – {formatCurrency(cashFlowData[0].netCashFlow)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2">Sale of Old Equipment – {formatCurrency(cashFlowData[0].saleOfOldEquipment)}</td>
                        <td className="border px-4 py-2">Salaries and Wages – {formatCurrency(cashFlowData[0].salariesAndWages)}</td>
                        <td className="border px-4 py-2">Utilities – {formatCurrency(cashFlowData[0].utilities)}</td>
                        <td className="border px-4 py-2">Beginning Balance – {formatCurrency(cashFlowData[0].beginningBalance)}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Total Inflows – {formatCurrency(cashFlowData[0].totalInflows)}</td>
                        <td className="border px-4 py-2 font-bold">Total Outflows – {formatCurrency(cashFlowData[0].totalOutflowsOperating)}</td>
                        <td className="border px-4 py-2 font-bold">Total Outflows – {formatCurrency(cashFlowData[0].totalOutflowsInvesting)}</td>
                        <td className="border px-4 py-2 font-bold">Ending Balance – {formatCurrency(rowData.endingBalance)}</td>
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
