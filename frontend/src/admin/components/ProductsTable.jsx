import React from "react";
import { Trash2, Edit, Eye } from "lucide-react";

const ROW_HEIGHT = 80;

const ProductsTable = ({ products, loading, onDelete, onEdit, onView }) => {

  return (
    <div className="border rounded-lg shadow bg-white">
      {/* هدر */}
      <div className="flex justify-between p-3 font-bold bg-gray-100">
        <span>محصولات ({products.length})</span>
      </div>

      {/* لیست محصولات */}
      {loading ? (
        <div className="p-3 text-center text-gray-500">در حال بارگذاری...</div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-2 border-b bg-white"
            style={{ height: ROW_HEIGHT }}
          >
            {/* اطلاعات محصول */}
            <div className="flex items-center gap-3">
              <img
                src={product.avator ? `http://localhost:5000${product.avator}` : "/no-image.png"}
                alt={product.model}
                className="w-14 h-14 object-cover rounded"
              />
              <div className="flex flex-col">
                <span className="font-semibold">
                  {product.brand} {product.model}
                </span>
                <span className="text-gray-500 text-sm">{product.priceUSD} $</span>
              </div>
            </div>

            {/* اکشن‌ها */}
            <div className="flex gap-2">
              <button
                onClick={() => onView(product)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))
      )}

      {(!loading && products.length === 0) && (
        <div className="p-3 text-center text-gray-500">هیچ محصولی موجود نیست</div>
      )}
    </div>
  );
};

export default ProductsTable;
