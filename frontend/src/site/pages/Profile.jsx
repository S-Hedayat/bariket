import { useEffect, useState } from "react";
import { fetchAccountById, updateAccount } from "../api";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const accountID = 1; // ✅ فعلاً ثابت، بعداً از سیستم لاگین می‌گیری

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchAccountById(accountID);
      setUser(data);
      setForm({ name: data.name, email: data.email, password: "" });
    };
    loadUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAccount(accountID, form);
      toast.success("✅ اطلاعات شما بروزرسانی شد");
    } catch (err) {
      toast.error("❌ خطا در بروزرسانی حساب");
    }
  };

  if (!user) return <p>در حال بارگذاری...</p>;

  return (
    <div className="max-w-xl mx-auto bg-blue-50 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">پروفایل کاربری</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">نام</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">ایمیل</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">رمز عبور جدید</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="برای تغییر وارد کنید"
            className="w-full bg-white rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
};

export default Profile;
