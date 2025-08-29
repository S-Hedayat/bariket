// Settings.jsx
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/accounts"; // مسیر API حساب‌ها

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">تنظیمات حساب کاربری</h1>
      {user && (
        <div className="space-y-2">
          <p><strong>نام:</strong> {user.name}</p>
          <p><strong>ایمیل:</strong> {user.email}</p>
          <p><strong>نقش:</strong> {user.role}</p>
          <p><strong>وضعیت:</strong> {user.status}</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
