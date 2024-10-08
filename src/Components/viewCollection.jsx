
import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { FaIndustry } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




function viewCollection() {
  const [cashAmount, setCashAmount] = useState(0);
  const [revenueAmount, setRevenueAmount] = useState(0);
  const [spentAmount, setSpent] = useState(0);
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };


  const inflowsData = [
    { name: 'January', amount: 4000 },
    { name: 'February', amount: 3000 },
    { name: 'March', amount: 5000 },
    { name: 'April', amount: 6000 },
  ];
  
  const outflowsData = [
    { name: 'January', amount: 2000 },
    { name: 'February', amount: 2500 },
    { name: 'March', amount: 1800 },
    { name: 'April', amount: 3200 },
  ];
  

  
  return (
    <>
    

        <div className="max-w-screen-2xl mx-auto flex flex-col ">
    <div className="p-4">
      
      <div className="flex gap-4">
          {/* Sales Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Total Cash of the Company</p>
              <BsCashCoin className="text-green-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">{formatCurrency(cashAmount)}</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 18.2%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
                +{formatCurrency(231)} <span className="text-gray-500">than past month</span>
              </p>
            </div>
          </div>
        </div>
          </div>

          <div className="p-4">
      {/* Financial chart */}
      <div className="bg-white/75 shadow-xl rounded-lg p-6">
        <div className="flex gap-4">
            {/* Revenue Card */}
            <div className="bg-white/75 shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-semibold text-sm">Total Revenue</p>
                <FaIndustry className="text-green-600 text-xl" />
              </div>
              <div className="flex gap-3 my-3">
                <p className="text-3xl font-bold">{formatCurrency(revenueAmount)}</p>
                <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                  <IoIosArrowUp className="text-green-700" /> 10.8%
                </p>
              </div>
              <div className="my-3">
                <p className="text-green-700 font-semibold">
                +{formatCurrency(12313)}<span className="text-gray-500"> than past month</span>
                </p>
              </div>
            </div>

            {/* Spending Card */}
            <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-semibold text-sm">Total Spent</p>
                <RiPassPendingLine className="text-red-600 text-xl" />
              </div>
              <div className="flex gap-3 my-3">
                <p className="text-3xl font-bold">{formatCurrency(spentAmount)}</p>
                <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
                  <IoIosArrowUp className="text-red-700" /> 9.1%
                </p>
              </div>
              <div className="my-3">
                <p className="text-red-700 font-semibold">
                  +{formatCurrency(3213)} <span className="text-gray-500">than past month</span>
                </p>
              </div>
            </div>
            </div>

        {/* Bar Charts Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Cash Flow</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Inflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Inflows</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inflowsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Outflows Chart */}
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Outflows</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={outflowsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#f55c47" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>

        </div>

    
    </>
  )
}

export default viewCollection
