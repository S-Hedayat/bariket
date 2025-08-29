import React from "react";
import { motion } from "framer-motion";

const PromoBanner = () => {
  const text = "🎉 تخفیف ویژه تا پنجاه برای مدت محدود!";

  return (
    <div className="bg-gradient-to-r from-pink-800 via-pink-300 to-red-600 overflow-hidden">
     {text}
    </div>
  );
};

export default PromoBanner;
