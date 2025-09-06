// src/components/HeroBanner.jsx
import React, { useState, useEffect } from "react";

const HeroBanner = ({
  title,
  subtitle,
  imageUrl,
  placeholderUrl,
  alt,
  ctaText,
  onCtaClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  return (
    <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Preload hero image */}
      <link rel="preload" as="image" href={imageUrl} />

      {/* placeholder blur */}
      <img
        src={placeholderUrl}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover filter blur-xl scale-105 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />

      {/* main image */}
      <img
        src={imageUrl}
        alt={alt || "Banner Image"}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out transform hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* text and CTA */}
      <div className="relative z-10 px-4 flex flex-col items-center justify-center">
        <h1
          className={`text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-lg md:text-2xl mb-6 drop-shadow-md transition-all duration-1000 delay-200 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          {subtitle}
        </p>
        {ctaText && onCtaClick && (
          <button
            onClick={onCtaClick}
            className={`bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-transform duration-500 shadow-lg ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
