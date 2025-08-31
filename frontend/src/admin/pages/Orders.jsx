import React, { useEffect, useState, useCallback } from "react";
import OrdersTable from "../components/OrdersTable";
import OrderModal from "../components/OrderModal";

const API_URL = "http://localhost:5000/api/orders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?page=${page}&limit=20`);
      if (!response.ok) throw new Error("خطا در دریافت سفارش‌ها");
      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("❌ خطا در گرفتن سفارش‌ها:", err);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت سفارش‌ها</h1>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری سفارش‌ها...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">هیچ سفارشی موجود نیست.</p>
      ) : (
        <OrdersTable orders={orders} onView={handleViewOrder} />
      )}

      {/* ---------- صفحه‌بندی ---------- */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1 || totalPages <= 1}
        >
          قبلی
        </button>
        <span className="px-3 py-1 border rounded">
          صفحه {page} از {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          بعدی
        </button>
      </div>

      {/* ---------- Order Modal ---------- */}
      {selectedOrder && (
        <OrderModal orderData={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Orders;
