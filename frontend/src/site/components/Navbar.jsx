import React, { useState, memo } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Package, Users, User, Info, Phone, Grid, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "خانه", icon: Home },
  { to: "/product", label: "محصولات", icon: Package },
  { to: "/cart", label: "سبد خرید", icon: Users },
  { to: "/profile", label: "پروفایل", icon: User },
  { to: "/about", label: "درباره ما", icon: Info },
  { to: "/contact", label: "تماس", icon: Phone },
  { to: "/admin/dashboard", label: "داشبورد ادمین", icon: Grid },
];

const linkClass = "flex items-center gap-2 px-4 py-3 rounded-md text-lg transition-colors";
const activeClass = "bg-blue-100 text-blue-700 font-semibold";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* لوگو */}
        <span className="font-bold text-lg cursor-pointer">Bariket</span>

        {/* لینک‌های دسکتاپ */}
        <div className="hidden md:flex gap-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : "hover:bg-blue-500"}`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* دکمه منو موبایل */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(prev => !prev)}
            className="p-2 rounded hover:bg-blue-500 transition"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* منوی موبایل تمام‌عرض */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col md:hidden"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* هدر منوی موبایل */}
            <div className="flex justify-between items-center p-4 border-b shadow-sm">
              <span className="font-bold text-xl text-blue-700">منو</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="p-2 rounded hover:bg-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* لینک‌ها */}
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? activeClass : "hover:bg-gray-100 text-blue-600"}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon size={22} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default memo(Navbar);
