import { useState } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Menu, X, Grid, Users, Clipboard, Package, Settings as SettingsIcon } from "lucide-react";

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

  const linkClass = "flex items-center gap-2 p-2 rounded hover:bg-blue-100 transition-colors";
  const activeClass = "bg-blue-200 font-semibold";

  return (
    <>
      {/* موبایل */}
      <div className="md:hidden bg-gray-100 p-4 shadow">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-gray-100 p-4 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* دسکتاپ */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-gray-100 md:min-h-screen md:p-4 md:shadow">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
