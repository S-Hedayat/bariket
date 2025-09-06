// src/admin/pages/Dashboard.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ---------- Card داخلی ----------
const Card = ({ children, className = "" }) => (
  <div className={`shadow-lg rounded-lg bg-white p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);

// ---------- داده نمونه ----------
const lineData = [
  { month: "فروردین", sales: 4000, users: 2400 },
  { month: "اردیبهشت", sales: 3000, users: 1398 },
  { month: "خرداد", sales: 2000, users: 9800 },
  { month: "تیر", sales: 2780, users: 3908 },
  { month: "مرداد", sales: 1890, users: 4800 },
  { month: "شهریور", sales: 2390, users: 3800 },
  { month: "مهر", sales: 3490, users: 4300 },
];

const barData = [
  { product: "لپ‌تاپ", quantity: 120 },
  { product: "موبایل", quantity: 300 },
  { product: "هدفون", quantity: 150 },
  { product: "کیبورد", quantity: 80 },
  { product: "مانیتور", quantity: 50 },
];

const Dashboard = () => {
  const lineChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} />
        <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  ), []);

  const barChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="product" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  ), []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">داشبورد مدیریت</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">نمودار فروش و کاربران</h2>
          <CardContent>{lineChart}</CardContent>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">محصولات پرفروش</h2>
          <CardContent>{barChart}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
