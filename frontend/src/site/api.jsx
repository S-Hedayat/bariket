// src/api/api.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper برای fetch با JWT (اختیاری)
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token"); // فرض بر JWT در localStorage
  const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "خطای شبکه");
  }
  return res.json();
};

// ----------------- Products -----------------
export const fetchProducts = async (page = 1, limit = 20) => {
  return fetchWithAuth(`${API_URL}/products?page=${page}&limit=${limit}`);
};

export const fetchProductById = async (id) => {
  return fetchWithAuth(`${API_URL}/products/${id}`);
};

// ----------------- Comments -----------------
export const fetchComments = async (productId) => {
  const url = productId ? `${API_URL}/comments?productID=${productId}` : `${API_URL}/comments`;
  return fetchWithAuth(url);
};

export const postComment = async (productId, content) => {
  return fetchWithAuth(`${API_URL}/comments`, {
    method: "POST",
    body: JSON.stringify({ productID: productId, content }),
  });
};

// ----------------- Accounts (Profile) -----------------
export const fetchAccountById = async (id) => {
  return fetchWithAuth(`${API_URL}/accounts/${id}`);
};

export const updateAccount = async (id, data) => {
  return fetchWithAuth(`${API_URL}/accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ----------------- Orders -----------------
export const createOrder = async (items, total) => {
  return fetchWithAuth(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify({ items, total }),
  });
};

export const fetchOrders = async (page = 1, limit = 20) => {
  return fetchWithAuth(`${API_URL}/orders?page=${page}&limit=${limit}`);
};

// ----------------- Login -----------------
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/accounts/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await res.json();
  if (data.token) localStorage.setItem("token", data.token); // ذخیره توکن برای درخواست‌های بعدی
  return data;
};

// ----------------- Logout -----------------
export const logout = () => {
  localStorage.removeItem("token");
};
