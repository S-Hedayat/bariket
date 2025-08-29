import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Comments = lazy(() => import("./pages/Comments"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
    در حال بارگذاری...
  </div>
);

const AppRoutes = () => {
  useEffect(() => {
    import("./pages/Dashboard");
    import("./pages/Products");
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="comments" element={<Comments />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
