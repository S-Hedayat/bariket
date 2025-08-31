import React, { useState, useEffect } from "react";

const UserModal = ({ user, onClose, onSave, readOnly = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: 1,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "user",
        status: user.status ?? 1,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave({ ...user, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="بستن پنجره"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold">{readOnly ? "مشاهده کاربر" : "ویرایش کاربر"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            نام کاربر
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
              disabled={readOnly}
            />
          </label>

          <label className="block">
            ایمیل
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
              disabled={readOnly}
            />
          </label>

          {!readOnly && (
            <label className="block">
              رمز عبور جدید (در صورت نیاز)
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </label>
          )}

          <label className="block">
            نقش
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={readOnly}
            >
              <option value="user">کاربر عادی</option>
              <option value="admin">ادمین</option>
            </select>
          </label>

          <label className="block">
            وضعیت
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={readOnly}
            >
              <option value={1}>فعال</option>
              <option value={0}>غیرفعال</option>
            </select>
          </label>

          {!readOnly && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ذخیره تغییرات
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserModal;
