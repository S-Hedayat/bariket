const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper برای fetch با JWT
const fetchWithAuth = async (url, options = {}, timeout = 10000) => {
  const token = localStorage.getItem("token");

  // اگر کاربر فایل آپلود می‌کند، هدر Content-Type رو خود مرورگر ست می‌کنه
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `خطای شبکه: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.name === "AbortError") throw new Error("درخواست بیش از حد طول کشید!");
    throw err;
  }
};

// ----------------- Products -----------------
export const fetchProducts = async () =>
  fetchWithAuth(`${API_URL}/products`);

export const fetchProductById = async (id) =>
  fetchWithAuth(`${API_URL}/products/${id}`);

export const createProduct = async (data) => {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  return fetchWithAuth(`${API_URL}/products`, {
    method: "POST",
    body: formData,
  });
};

export const updateProduct = async (id, data) => {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  return fetchWithAuth(`${API_URL}/products/${id}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteProduct = async (id) =>
  fetchWithAuth(`${API_URL}/products/${id}`, { method: "DELETE" });

// ----------------- Comments -----------------
export const fetchComments = async (productId) => {
  const url = productId ? `${API_URL}/comments?productID=${productId}` : `${API_URL}/comments`;
  return fetchWithAuth(url);
};

export const postComment = async (productId, content) =>
  fetchWithAuth(`${API_URL}/comments`, {
    method: "POST",
    body: JSON.stringify({ productID: productId, content }),
  });

// ----------------- Accounts (Profile) -----------------
export const fetchAccountById = async (id) =>
  fetchWithAuth(`${API_URL}/accounts/${id}`);

export const updateAccount = async (id, data) => {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  return fetchWithAuth(`${API_URL}/accounts/${id}`, {
    method: "PUT",
    body: formData,
  });
};

// ----------------- Orders -----------------
export const createOrder = async (items, total) =>
  fetchWithAuth(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify({ items, total }),
  });

export const fetchOrders = async () =>
  fetchWithAuth(`${API_URL}/orders`);

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
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

// ----------------- Logout -----------------
export const logout = () => {
  localStorage.removeItem("token");
};
