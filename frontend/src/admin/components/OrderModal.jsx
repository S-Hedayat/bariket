import React from "react";

const OrderModal = ({ orderData, onClose }) => {
  if (!orderData) return null; // جلوگیری از رندر خالی

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div className="bg-white p-4 rounded-lg w-11/12 max-w-md max-h-[90vh] overflow-auto">
        <h2 id="order-modal-title" className="text-xl font-bold mb-2">
          سفارش #{orderData.order.id}
        </h2>
        <p><strong>نام مشتری:</strong> {orderData.order.userName}</p>
        <p><strong>مجموع:</strong> {orderData.order.total} تومان</p>
        <p><strong>وضعیت:</strong> {orderData.order.status}</p>

        <h3 className="mt-4 font-semibold">آیتم‌ها:</h3>
        <ul className="list-disc list-inside">
          {orderData.items.map((item) => (
            <li key={item.id}>
              {item.productBrand} {item.productModel} - تعداد: {item.quantity} - قیمت: {item.price} تومان
            </li>
          ))}
        </ul>

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onClose}
          aria-label="بستن سفارش"
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default React.memo(OrderModal);
