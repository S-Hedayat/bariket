import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import 'swiper/css/pagination'
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

const ProductSlider = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-blue-100 via-gray-200 to-gray-100 py-8 px-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={products.length > 1}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductSlider

