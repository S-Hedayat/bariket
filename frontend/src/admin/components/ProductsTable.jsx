import React, { useMemo } from "react";
import { List, AutoSizer } from "react-virtualized";
import { Trash2, Edit, Eye } from "lucide-react";

const ROW_HEIGHT_DESKTOP = 80;
const ROW_HEIGHT_MOBILE = 260; // ارتفاع کافی برای موبایل

const ProductsVirtualTable = ({ products, onDelete, onEdit, onView }) => {
  const productsWithAvator = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        displayAvator: p.avator
          ? `${p.avator}?t=${p.updatedAt || p.id}`
          : "/no-image.png",
      })),
    [products]
  );

  if (!products.length)
    return (
      <div className="p-3 text-center text-gray-500">
        هیچ محصولی موجود نیست
      </div>
    );

  const rowRenderer = ({ key, index, style, parentWidth }) => {
    const product = productsWithAvator[index];
    const isMobile = parentWidth <= 640;

    return (
      <div
        key={key}
        style={style}
        className={`flex ${
          isMobile
            ? "flex-col items-start gap-3 p-4"
            : "items-center justify-around p-2"
        } border-b bg-white shadow-sm`}
      >
        {/* تصویر + اطلاعات محصول */}
        <div
          className={`flex ${isMobile ? "flex-col items-center w-full gap-3" : "items-center gap-3"}`}
        >
          <img
            src={product.displayAvator}
            alt={product.model}
            className={`object-cover rounded ${
              isMobile ? "w-28 h-28" : "w-14 h-14"
            }`}
          />
          <div className="flex flex-col items-start text-center sm:text-left">
            <span className="font-semibold text-sm md:text-lg">{product.brand} {product.model}</span>
            <span className="text-gray-500 text-[12px] md:text-sm">{product.priceUSD} $</span>
          </div>

          {/* دکمه‌ها در موبایل زیر کارت */}
          {isMobile && (
            <div className="flex w-full justify-around mt-3">
              <button
                onClick={() => onView(product)}
                className="flex items-center justify-center p-2 bg-blue-100 text-blue-700 rounded shadow hover:bg-blue-200"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => onEdit(product)}
                className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded shadow hover:bg-green-200"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex items-center justify-center p-2 bg-red-100 text-red-700 rounded shadow hover:bg-red-200"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        {/* دکمه‌ها در دسکتاپ کنار محصول */}
        {!isMobile && (
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
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg shadow bg-white" style={{ height: "600px" }}>
      <div className="flex justify-between p-3 font-bold bg-gray-100">
        محصولات ({products.length})
      </div>
      <div style={{ height: "calc(100% - 40px)" }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={products.length}
              rowHeight={
                width <= 640 ? ROW_HEIGHT_MOBILE : ROW_HEIGHT_DESKTOP
              }
              rowRenderer={(props) =>
                rowRenderer({ ...props, parentWidth: width })
              }
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default React.memo(ProductsVirtualTable);
