import React, { useEffect, useState, useCallback } from "react";
import OrdersTable from "../components/OrdersTable";

const API_URL = "http://localhost:5000/api/orders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?page=${page}&limit=20`);
      if (!response.ok) throw new Error("خطا در دریافت سفارش‌ها");
      const data = await response.json();
      setOrders(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("❌ خطا در گرفتن سفارش‌ها:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">سفارش‌ها</h1>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <OrdersTable orders={orders} />
      )}

      {/* صفحه‌بندی */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          قبلی
        </button>
        <span className="px-3 py-1 border rounded">
          صفحه {page} از {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default Orders;
