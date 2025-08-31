// src/pages/Cart.jsx
import React, { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const API_IMAGE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, checkout } = useCart();

  // جمع کل با useMemo برای پرفورمنس
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + (item.priceUSD || 0) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("❌ سبد خرید خالی است");
      return;
    }

    try {
      const accountID = 1; // فعلاً ثابت
      const result = await checkout(accountID);
      toast.success("✅ سفارش ثبت شد. کد سفارش: " + result.insertedId);
    } catch (err) {
      toast.error("❌ خطا در ثبت سفارش");
    }
  };

  if (!cartItems) return null; // جلوگیری از render قبل از mount

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">سبد خرید شما</h1>

      {cartItems.length === 0 ? (
        <p>
          سبد خرید خالی است.{" "}
          <Link to="/" className="text-blue-600 underline">
            برگشت به فروشگاه
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => {
            const imageUrl = item.thumbnail
              ? `${API_IMAGE_URL}${item.thumbnail}`
              : item.avator
              ? `${API_IMAGE_URL}${item.avator}`
              : "https://via.placeholder.com/80";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt={`${item.brand} ${item.model}`}
                    className="w-20 h-20 object-cover rounded"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold">
                      {item.brand} {item.model}
                    </p>
                    <p className="text-gray-500 text-sm">
                      قیمت: ${item.priceUSD || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })}

          {/* جمع کل و دکمه Checkout */}
          <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
            <p className="text-lg font-bold">جمع کل: ${totalPrice}</p>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              ثبت سفارش
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
