import { useState } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  Grid,
  Users,
  Clipboard,
  Package,
  Settings as SettingsIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: <Home size={16} /> },
    { to: "/admin/dashboard", label: "Dashboard", icon: <Grid size={16} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={16} /> },
    { to: "/admin/orders", label: "Orders", icon: <Clipboard size={16} /> },
    { to: "/admin/products", label: "Products", icon: <Package size={16} /> },
    { to: "/admin/comments", label: "Comments", icon: <Clipboard size={16} /> },
    { to: "/admin/settings", label: "Settings", icon: <SettingsIcon size={16} /> },
  ];

  const linkClass =
    "flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-200 font-semibold";

  return (
    <>
      {/* دکمه منو در موبایل */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="باز کردن منو"
          className="md:hidden fixed top-4 left-4 z-50 bg-gray-100 p-2 rounded shadow"
        >
          <Menu size={24} />
        </button>
      )}

      {/* سایدبار موبایل با انیمیشن */}
      <AnimatePresence>
        {open && (
          <>
            {/* بک‌دراپ تیره پشت منو */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* خود سایدبار */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-gray-100 z-50 shadow-lg flex flex-col p-6 gap-4"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* بالای سایدبار */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Bariket</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن منو"
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* لینک‌ها */}
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? activeClass : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* دسکتاپ */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-gray-100 md:min-h-screen md:p-4 md:shadow">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
