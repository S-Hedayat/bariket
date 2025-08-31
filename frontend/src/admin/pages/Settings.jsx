// Settings.jsx
import React, { useEffect, useState } from "react";
import UserModal from "../components/UserModal";

const API_URL = "http://localhost:5000/api/accounts";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // 📥 دریافت اطلاعات کاربر
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        setError("کاربری یافت نشد");
        setUser(null);
      } else {
        setUser(data[0]); // اولین کاربر را انتخاب می‌کنیم
        setError("");
      }
    } catch (err) {
      setError("خطا در دریافت اطلاعات کاربر");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✏️ ذخیره تغییرات کاربر
  const handleSaveUser = async (updatedUser) => {
    try {
      const res = await fetch(`${API_URL}/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی کاربر");
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      alert(err.message || "خطا در بروزرسانی کاربر");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">تنظیمات حساب کاربری</h1>

      {user && (
        <div className="space-y-2 border p-4 rounded bg-white shadow">
          <p><strong>نام:</strong> {user.name}</p>
          <p><strong>ایمیل:</strong> {user.email}</p>
          <p><strong>نقش:</strong> {user.role}</p>
          <p><strong>وضعیت:</strong> {user.status === 1 ? "فعال" : "غیرفعال"}</p>

          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setEditingUser(user)}
          >
            ویرایش حساب
          </button>
        </div>
      )}

      {/* مودال ویرایش */}
      {editingUser && (
        <UserModal
          user={editingUser}
          readOnly={false}
          onClose={() => setEditingUser(null)}
          onSave={(updated) => {
            handleSaveUser(updated);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Settings;
