import Sidebar from "./components/Slidebar";
import Header from "./components/Header";
import AppRoutes from "./AppRoutes";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-4">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
