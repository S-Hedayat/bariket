import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

// Context
const CartContext = createContext();

// Hook برای دسترسی راحت‌تر
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
  // بارگذاری اولیه از localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ذخیره در localStorage هنگام تغییر cartItems
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // اضافه کردن محصول به سبد
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    toast.success(`✅ ${product.brand} ${product.model} به سبد اضافه شد`);
  };

  // حذف محصول
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast("🗑️ محصول از سبد حذف شد");
  };

  // تغییر تعداد محصول
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return; // حداقل 1
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // جمع کل با useMemo برای پرفورمنس
  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.priceUSD * item.quantity, 0),
    [cartItems]
  );

  // ثبت سفارش در سرور
  const checkout = async (accountID) => {
    try {
      if (cartItems.length === 0) {
        toast.error("❌ سبد خرید خالی است");
        return;
      }

      const orderData = {
        accountID,
        total: totalPrice,
        status: "pending",
        items: cartItems.map((item) => ({
          productID: item.id,
          quantity: item.quantity,
          price: item.priceUSD,
        })),
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطای ناشناخته در ثبت سفارش");
      }

      const data = await res.json();
      toast.success("✅ سفارش ثبت شد. کد سفارش: " + data.insertedId);

      // بعد از موفقیت، سبد را خالی کن
      setCartItems([]);

      return data;
    } catch (err) {
      console.error("❌ خطا در ثبت سفارش:", err);
      toast.error(err.message || "❌ خطا در ثبت سفارش");
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
