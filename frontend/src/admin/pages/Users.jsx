// src/pages/Users.jsx
import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { fetchAccounts, deleteAccount, updateAccount } from "../../site/api";

// Lazy load کامپوننت‌ها
const UsersTable = React.lazy(() => import("../components/UsersTable"));
const UserModal = React.lazy(() => import("../components/UserModal"));

const Users = () => {
  const [data, setData] = useState({ users: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Banner
  const banner = useMemo(
    () => <h2 className="text-xl md:text-2xl font-bold mb-6">مدیریت کاربران</h2>,
    []
  );

  // تعداد کل صفحات
  const totalPages = useMemo(
    () => Math.ceil(data.total / limit),
    [data.total, limit]
  );

  // Load users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAccounts(page, limit);
      setData({ users: res.users, total: res.total });
    } catch (err) {
      console.error("❌ خطا در دریافت کاربران:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Delete user
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) return;
      try {
        await deleteAccount(id);
        await loadUsers();
      } catch (err) {
        console.error("❌ خطا در حذف کاربر:", err);
      }
    },
    [loadUsers]
  );

  // Save edited user
  const handleEditSave = useCallback(
    async (updated) => {
      try {
        await updateAccount(updated.id, updated);
        setEditingUser(null);
        await loadUsers();
      } catch (err) {
        console.error("❌ خطا در ویرایش کاربر:", err);
      }
    },
    [loadUsers]
  );

  return (
    <div className="w-full space-y-6">
      {banner}
      <p className="text-gray-600">تعداد کل کاربران: {data.total}</p>

      {/* ---------- UsersTable with Suspense and Skeleton ---------- */}
      <Suspense
        fallback={
          <div className="space-y-3 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center animate-pulse p-3 border-b bg-gray-200 rounded"
              >
                <div className="bg-gray-300 rounded h-6 w-32">&nbsp;</div>
                <div className="flex gap-2">
                  <div className="bg-gray-300 rounded h-6 w-12">&nbsp;</div>
                  <div className="bg-gray-300 rounded h-6 w-12">&nbsp;</div>
                  <div className="bg-gray-300 rounded h-6 w-12">&nbsp;</div>
                </div>
              </div>
            ))}
          </div>
        }
      >
        <UsersTable
          users={data.users}
          loading={loading}
          onDelete={handleDelete}
          onEdit={setEditingUser}
          onView={setViewingUser}
        />
      </Suspense>

      {/* ---------- Pagination ---------- */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          قبلی
        </button>
        <span>
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          بعدی
        </button>
      </div>

      {/* ---------- Modals ---------- */}
      <Suspense fallback={null}>
        {editingUser && (
          <UserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleEditSave}
          />
        )}
        {viewingUser && (
          <UserModal user={viewingUser} onClose={() => setViewingUser(null)} readOnly />
        )}
      </Suspense>
    </div>
  );
};

export default Users;
