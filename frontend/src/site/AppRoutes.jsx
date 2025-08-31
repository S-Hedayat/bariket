// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from './components/Navbar'
// صفحات Lazy Load
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Product"));          // لیست محصولات
const ProductDetails = lazy(() => import("./pages/ProductDetails")); // جزئیات محصول
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
    در حال بارگذاری...
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* لیست محصولات */}
      <Route path="/product" element={<Products />} />

      {/* جزئیات محصول */}
      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/about" element={<About />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />

      {/* صفحه 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
