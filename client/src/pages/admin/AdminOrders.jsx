
import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import { Pencil, Trash } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  defs,
  linearGradient,
  stop,
} from "recharts";
import SidebarLayout from "../../layouts/SidebarLayout";
import "react-toastify/dist/ReactToastify.css";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchSummary();
    fetchMonthlyChartData();

    socket.on("newOrder", (data) => {
      toast.success(`🆕 New Order: ₹${data.totalPrice}`);
      fetchOrders();
      fetchSummary();
      fetchMonthlyChartData();
    });

    return () => socket.off("newOrder");
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized! Please login again.");
    try {
      const res = await axios.get("http://localhost:5000/api/order/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response?.status === 401) toast.error("Session expired. Please login again.");
    }
  };

  const fetchSummary = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized! Please login again.");
    try {
      const summaryRes = await axios.get(
        "http://localhost:5000/api/admin/dashboard-summary",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const revenueRes = await axios.get(
        "http://localhost:5000/api/order/total-revenue",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSummary({
        ...summaryRes.data,
        totalRevenue: revenueRes.data.totalRevenue,
      });
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const fetchMonthlyChartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/order/monthly-sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyData(res.data);
    } catch (err) {
      console.error("Error fetching monthly chart data:", err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:5000/api/order/update-status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handlePaymentChange = async (orderId, paymentStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:5000/api/order/update-status/${orderId}`,
        { paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update payment:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      if (window.confirm("Are you sure you want to delete this order?")) {
        await axios.delete(`http://localhost:5000/api/order/${orderId}`, {
             headers: { Authorization: `Bearer ${token}` },
              });


        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  const formatNumber = (num) => new Intl.NumberFormat("en-IN").format(num);

  return (
    <SidebarLayout>
      <div className="min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">📊 Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Revenue"
            value={`₹${formatNumber(summary?.totalRevenue || 0)}`}
            growth={summary?.growthRevenue || 0}
          />
          <SummaryCard
            title="Active Users"
            value={formatNumber(summary?.totalCustomers || 0)}
            growth={summary?.growthUsers || 0}
          />
          <SummaryCard title="CLTV" value="₹849.54" growth={summary?.growthCLTV || 0} />
          <SummaryCard title="CAC" value="₹9528" growth={summary?.growthCAC || 0} />
        </div>

        {/* Analytics Section */}
        <AnalyticsBlocks />

        {/* 3D Styled Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">📈 Monthly Revenue (3D Effect)</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">📦 All Orders</h2>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-indigo-100 text-indigo-800 uppercase">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Email</th>
                <th className="p-3">Product</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order.user?.name}</td>
                  <td className="p-3">{order.user?.email}</td>
                  <td className="p-3">{order.items.map((item) => item.product?.name).join(", ")}</td>
                  <td className="p-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="p-3 font-semibold">₹{order.totalPrice}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.paymentStatus || "Pending"}
                      onChange={(e) => handlePaymentChange(order._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                    </select>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-3 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </SidebarLayout>
  );
}

// ✅ Summary Card
function SummaryCard({ title, value, growth }) {
  const isPositive = growth >= 0;
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <span className={isPositive ? "text-green-600" : "text-red-600"}>
          {isPositive ? <span className="animate-bounce">▲</span> : <span className="animate-pulse">▼</span>}
          &nbsp;{Math.abs(growth)}%
        </span>
      </div>
    </div>
  );
}

// ✅ Analytics Dummy Block
function AnalyticsBlocks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-sm text-gray-600 mb-1">Churn Rate</p>
        <p className="text-gray-500 text-xs">Downgrade to Free plan</p>
        <p className="text-2xl font-bold mt-2">4.26%</p>
        <p className="text-red-500 text-xs mt-1">▼ 0.31% than last week</p>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-sm text-gray-600 mb-1">User Growth</p>
        <p className="text-gray-500 text-xs">New signups (website + mobile)</p>
        <p className="text-2xl font-bold mt-2">3,768</p>
        <p className="text-green-500 text-xs mt-1">▲ 3.85% than last week</p>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
        <p className="text-sm text-gray-600 mb-2">Product Performance</p>
        <div className="flex justify-between text-sm mb-2">
          <div>
            <p>📦 Digital Product</p>
            <p className="text-green-600 font-bold">↑ 790</p>
          </div>
          <div>
            <p>📦 Physical Product</p>
            <p className="text-red-600 font-bold">↓ 572</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Avg Daily Sales</p>
          <p className="text-xl font-bold">
            ₹2,950 <span className="text-red-500 text-xs">▼ 0.52%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
