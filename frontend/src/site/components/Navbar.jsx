import React, { useState, memo, Suspense, lazy } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load icons
const HomeIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Home })));
const PackageIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Package })));
const UsersIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Users })));
const UserIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.User })));
const InfoIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Info })));
const PhoneIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Phone })));
const GridIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Grid })));
const MenuIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.Menu })));
const XIcon = lazy(() => import("lucide-react").then(mod => ({ default: mod.X })));

const navLinks = [
  { to: "/", label: "خانه", icon: HomeIcon },
  { to: "/product", label: "محصولات", icon: PackageIcon },
  { to: "/card", label: "سبد خرید", icon: UsersIcon },
  { to: "/profile", label: "پروفایل", icon: UserIcon },
  { to: "/about", label: "درباره ما", icon: InfoIcon },
  { to: "/contact", label: "تماس", icon: PhoneIcon },
  { to: "/admin/dashboard", label: "داشبورد ادمین", icon: GridIcon },
];

const linkClass = "flex items-center gap-2 px-4 py-2 rounded-md min-h-[48px]";
const activeClass = "bg-white";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-300 shadow-md p-4 relative">
      {/* Desktop */}
      <div className="hidden md:flex gap-4">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Suspense key={to} fallback={<div className="w-5 h-5 bg-gray-200 rounded" />}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="leading-none">{label}</span>
            </NavLink>
          </Suspense>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden justify-between items-center">
        <span className="font-bold text-lg">Bariket</span>
        <Suspense fallback={<div className="w-6 h-6 bg-gray-200 rounded" />}>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(prev => !prev)}
            className="p-2"
          >
            {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </Suspense>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 1000 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col mt-2 bg-white shadow-md rounded-md md:hidden overflow-hidden"
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Suspense key={to} fallback={<div className="w-5 h-5 bg-gray-200 rounded my-1" />}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="leading-none">{label}</span>
                </NavLink>
              </Suspense>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default memo(Navbar);
