import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, checkout } =
    useCart();

  const handleCheckout = async () => {
    try {
      const accountID = 1; // 🔑 فعلاً ثابت، بعداً از لاگین کاربر می‌گیری
      const result = await checkout(accountID);
      toast.success("✅ سفارش ثبت شد. کد سفارش: " + result.insertedId);
    } catch (err) {
      toast.error("❌ خطا در ثبت سفارش");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">سبد خرید</h2>

      {cartItems.length === 0 ? (
        <p>
          سبد خرید خالی است. <Link to="/">برگشت به فروشگاه</Link>
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {item.brand} {item.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    قیمت: ${item.priceUSD} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-bold">جمع کل: ${totalPrice}</p>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ثبت سفارش
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
