import React, { useState, useEffect } from "react";
import { FaUserCheck, FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle } from "react-icons/fa"; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; 

const Dashboard = () => {
  // sample data
  const [dashboardData, setDashboardData] = useState({
    accountRequests: 50,
    invoiceRequests: 120,
    approvedInvoices: 100,
    rejectedInvoices: 20,
    marketTrendsData: [
      { name: "Page A", uv: 4000, pv: 2400 },
      { name: "Page B", uv: 3000, pv: 1398 },
      { name: "Page C", uv: 2000, pv: 9800 },
      { name: "Page D", uv: 2780, pv: 3908 },
      { name: "Page E", uv: 1890, pv: 4800 },
      { name: "Page F", uv: 2390, pv: 3800 },
      { name: "Page G", uv: 3490, pv: 4300 },
    ],
  });

  useEffect(() => {
    const fetchDashboardData = () => {
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard p-6">
      <h2 className="text-3xl font-bold mb-4">Dashboard Overview</h2>
      <div className="overview grid grid-cols-4 gap-6 mb-10">
        <Card
          icon={<FaUserCheck className="text-blue-500 text-4xl" />}
          title="Account Requests"
          value={dashboardData.accountRequests}
        />
        <Card
          icon={<FaFileInvoiceDollar className="text-green-500 text-4xl" />}
          title="Invoice Requests"
          value={dashboardData.invoiceRequests}
        />
        <Card
          icon={<FaCheckCircle className="text-green-500 text-4xl" />}
          title="Approved Invoices"
          value={dashboardData.approvedInvoices}
        />
        <Card
          icon={<FaTimesCircle className="text-red-500 text-4xl" />}
          title="Rejected Invoices"
          value={dashboardData.rejectedInvoices}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Market Trends</h2>
      <div className="market-trends-section bg-white rounded-xl shadow-xl p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={dashboardData.marketTrendsData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        
      </div>
    </div>
  );
};


const Card = ({ icon, title, value }) => {
  return (
    <div className="card bg-white p-6 rounded-lg shadow-xl hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
