import React from "react";

const OrderModal = ({ orderData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-11/12 max-w-md max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-2">سفارش #{orderData.order.id}</h2>
        <p>نام مشتری: {orderData.order.userName}</p>
        <p>مجموع: {orderData.order.total} تومان</p>
        <p>وضعیت: {orderData.order.status}</p>

        <h3 className="mt-4 font-semibold">آیتم‌ها:</h3>
        <ul className="list-disc list-inside">
          {orderData.items.map((item) => (
            <li key={item.id}>
              {item.productBrand} {item.productModel} - تعداد: {item.quantity} - قیمت: {item.price} تومان
            </li>
          ))}
        </ul>

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
