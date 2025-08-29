import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* لوگو و توضیح */}
        <div>
          <h2 className="text-2xl font-bold text-white">Bariket</h2>
          <p className="mt-3 text-sm text-gray-400">
            فروشگاهی آنلاین با بهترین محصولات و خدمات. تجربه خرید راحت و سریع.
          </p>
        </div>

        {/* لینک‌های سریع */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">لینک‌ها</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">خانه</Link>
            </li>
            <li>
              <Link to="/product" className="hover:text-white transition">محصولات</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">درباره ما</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">تماس با ما</Link>
            </li>
          </ul>
        </div>

        {/* تماس */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">ارتباط با ما</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={18} />
              <span>+98 912 123 4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} />
              <span>support@bariket.com</span>
            </li>
          </ul>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">دنبال کنید</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-500 transition">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Bariket. تمام حقوق محفوظ است.
      </div>
    </footer>
  );
};

export default Footer;
