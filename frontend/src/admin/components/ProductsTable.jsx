// frontend/src/components/ProductsVirtualTable.jsx
import React, { useMemo } from "react";
import { List, AutoSizer } from "react-virtualized";
import { Trash2, Edit, Eye } from "lucide-react";

const ROW_HEIGHT = 80;

const ProductsVirtualTable = ({ products, onDelete, onEdit, onView }) => {
  // مسیر تصاویر فقط وقتی محصولات تغییر کنند recalculated می‌شوند
  const productsWithAvator = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        displayAvator: p.avator ? `${p.avator}?t=${p.updatedAt || p.id}` : "/no-image.png",
      })),
    [products]
  );

  const rowRenderer = ({ key, index, style }) => {
    const product = productsWithAvator[index];
    return (
      <div
        key={key}
        style={style}
        className="flex items-center justify-between p-2 border-b bg-white"
      >
        <div className="flex items-center gap-3">
          <img
            src={product.displayAvator}
            alt={product.model}
            className="w-14 h-14 object-cover rounded"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{product.brand} {product.model}</span>
            <span className="text-gray-500 text-sm">{product.priceUSD} $</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onView(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Eye size={20} />
          </button>
          <button onClick={() => onEdit(product)} className="p-2 text-green-600 hover:bg-green-50 rounded">
            <Edit size={20} />
          </button>
          <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    );
  };

  if (!products.length)
    return <div className="p-3 text-center text-gray-500">هیچ محصولی موجود نیست</div>;

  return (
    <div className="border rounded-lg shadow bg-white" style={{ height: 600 }}>
      <div className="flex justify-between p-3 font-bold bg-gray-100">
        محصولات ({products.length})
      </div>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height - 40}
            rowCount={products.length}
            rowHeight={ROW_HEIGHT}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(ProductsVirtualTable);
