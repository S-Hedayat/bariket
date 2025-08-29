import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4">
      {/* تصویر Thumbnail */}
      <Link to={`/products/${product.id}`}>
        <img
          src={`http://localhost:5000${product.avator.replace(".webp", "-thumb.webp")}`}
          alt={`${product.brand} ${product.model}`}
          className="w-full h-48 object-cover rounded-xl mb-3"
          loading="lazy"
        />
      </Link>

      {/* جزئیات محصول */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.brand} {product.model}
        </h3>
        <p className="text-gray-500 text-sm">{product.categoryName}</p>
        <p className="text-blue-600 font-bold mt-2">${product.priceUSD}</p>
      </div>

      {/* دکمه مشاهده جزئیات */}
      <Link
        to={`/products/${product.id}`}
        className="mt-3 inline-block text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
