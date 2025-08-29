import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`خوش آمدید ${user.name}`);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/"); // هدایت بعد از لاگین
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">ورود به Bariket</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
};

export default Login;
