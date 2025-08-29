import React from "react";

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">جزئیات محصول</h2>
        {product.avator && <img src={`http://localhost:5000${product.avator}`} alt={product.model} className="w-32 h-32 object-cover rounded mx-auto"/>}
        <div className="space-y-2">
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Model:</strong> {product.model}</p>
          <p><strong>Price:</strong> ${product.priceUSD}</p>
          <p><strong>Category:</strong> {product.categoryName}</p>
          <p><strong>CPU:</strong> {product.cpu || "-"}</p>
          <p><strong>RAM:</strong> {product.ram || "-"}</p>
          <p><strong>Storage:</strong> {product.storage || "-"}</p>
          <p><strong>OS:</strong> {product.os || "-"}</p>
          <p><strong>Stock Status:</strong> {product.stockStatus ? "In Stock" : "Out of Stock"}</p>
          <p><strong>Num Stock:</strong> {product.numStockStatus}</p>
          <p><strong>Discount:</strong> {product.offs || 0}%</p>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">بستن</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
