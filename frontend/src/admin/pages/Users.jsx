import React, { useState, useEffect, useCallback } from "react";
import UsersTable from "../components/UsersTable";
import UserModal from "../components/UserModal";

const API_URL = "http://localhost:5000/api/accounts";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // ---------- Fetch users ----------
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?offset=${(page-1)*limit}&limit=${limit}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
      setTotal(data.total || data.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ---------- Delete user ----------
  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف کاربر");
      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Edit user ----------
  const handleEditSave = async (updated) => {
    try {
      const res = await fetch(`${API_URL}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی کاربر");
      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">مدیریت کاربران</h1>
      <p className="text-gray-600">تعداد کل کاربران: {total}</p>

      <UsersTable
        users={users}
        loading={loading}
        onDelete={handleDelete}
        onEdit={setEditingUser}
        onView={setViewingUser}
      />

      {/* ---------- Pagination ---------- */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button onClick={() => setPage(prev => Math.max(prev-1,1))} disabled={page===1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">قبلی</button>
        <span>صفحه {page} از {Math.ceil(total/limit)}</span>
        <button onClick={() => setPage(prev => (prev<Math.ceil(total/limit)? prev+1:prev))} disabled={page>=Math.ceil(total/limit)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">بعدی</button>
      </div>

      {/* ---------- Modals ---------- */}
      {editingUser && <UserModal user={editingUser} onClose={()=>setEditingUser(null)} onSave={handleEditSave} />}
      {viewingUser && <UserModal user={viewingUser} onClose={()=>setViewingUser(null)} readOnly />}
    </div>
  );
};

export default Users;
