import React from "react";
import { motion } from "framer-motion";

const PromoBanner = ({ message }) => {
  return (
    <motion.div
      className="w-full bg-red-500 text-white text-center py-3 md:py-4 px-2 md:px-0 text-sm md:text-lg font-semibold shadow-md"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <p className="truncate md:truncate-none">{message}</p>
    </motion.div>
  );
};

export default React.memo(PromoBanner);
