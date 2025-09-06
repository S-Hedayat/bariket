// src/admin/pages/Orders.jsx
import React, { useState, useEffect, useCallback } from "react";
import OrdersTable from "../components/OrdersTable";
import OrderModal from "../components/OrderModal";
import { fetchOrders } from "../../site/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  // 📥 گرفتن سفارش‌ها با صفحه‌بندی
  const loadOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { orders, total } = await fetchOrders(page, LIMIT);
      setOrders(orders);
      setTotalPages(Math.ceil(total / LIMIT));
    } catch (err) {
      console.error("خطا در دریافت سفارش‌ها:", err);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(page);
  }, [loadOrders, page]);

  // نمایش جزئیات سفارش
  const handleViewOrder = (order) => setSelectedOrder(order);
  const handleCloseModal = () => setSelectedOrder(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت سفارش‌ها</h1>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری سفارش‌ها...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">هیچ سفارشی یافت نشد.</p>
      ) : (
        <OrdersTable orders={orders} onView={handleViewOrder} />
      )}

      {/* ---------- صفحه‌بندی ---------- */}
      {orders.length > 0 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
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
      )}

      {/* ---------- Order Modal ---------- */}
      {selectedOrder && (
        <OrderModal orderData={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Orders;
