import React from "react";
import { Link } from "react-router-dom";

const ProductCard = React.memo(({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-3 w-56">
      <Link to={`/products/${product.id}`}>
        <img
          src={`http://localhost:5000/uploads/${product.avator.replace(".webp", "-thumb.webp")}`}
          alt={`${product.brand} ${product.model}`}
          className="w-full h-32 object-cover rounded-lg mb-2"
          loading="lazy"   // مهم برای performance
        />
      </Link>

      <div className="flex flex-col">
        <h3 className="text-md font-semibold text-gray-800 truncate">
          {product.brand} {product.model}
        </h3>
        <p className="text-gray-500 text-xs truncate">{product.categoryName}</p>
        <p className="text-blue-600 font-bold mt-1 text-sm">${product.priceUSD}</p>
      </div>

      <Link
        to={`/products/${product.id}`}
        className="mt-2 inline-block text-center bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-lg hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
});

export default ProductCard;
