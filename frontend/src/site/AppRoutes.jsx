import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Card = lazy(() => import("./pages/Card"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
    در حال بارگذاری...
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/card" element={<Card />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
