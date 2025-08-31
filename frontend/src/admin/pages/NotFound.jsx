import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <p className="mb-6 text-lg">صفحه مورد نظر پیدا نشد!</p>
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        بازگشت به داشبورد
      </button>
    </div>
  );
};

export default NotFound;
