import { lazy, useMemo } from "react";
import AppRoutes from "./AppRoutes";

const Sidebar = lazy(() => import("./components/Slidebar"));

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-4 flex-1 overflow-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
