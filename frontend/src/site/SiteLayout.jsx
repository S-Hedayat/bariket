import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";

const SiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <AppRoutes />
      </main>
      <Footer />

      {/* Toaster برای نمایش پیام‌ها */}
      <Toaster position="top-center" />
    </div>
  );
};

export default SiteLayout;
