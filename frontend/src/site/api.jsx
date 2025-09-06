// src/api.jsx
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://bariket.onrender.com/api");

// ----------------- Helpers -----------------
const normalizeProducts = (products) =>
  (Array.isArray(products) ? products : []).map((p) => ({
    ...p,
    avator: p.avator
      ? `${API_BASE_URL.replace("/api", "")}${p.avator}`
      : null,
    updatedAt: p.updatedAt || Date.now(),
  }));

const normalizeOrders = (orders) =>
  (Array.isArray(orders) ? orders : []).map((o) => ({
    ...o,
    updatedAt: o.updatedAt || Date.now(),
  }));

const normalizeUsers = (users) =>
  (Array.isArray(users) ? users : []).map((u) => ({
    ...u,
    updatedAt: u.updatedAt || Date.now(),
  }));

// ----------------- Fetch With Auth -----------------
const fetchWithAuth = async (url, options = {}, timeout = 10000) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `خطای شبکه: ${res.status}`);
    return data;
  } catch (err) {
    clearTimeout(id);
    if (err.name === "AbortError")
      throw new Error("درخواست بیش از حد طول کشید!");
    throw err;
  }
};

// ----------------- Products -----------------
export const fetchProducts = async (page = 1, limit = 12) => {
  const data = await fetchWithAuth(
    `${API_BASE_URL}/products?page=${page}&limit=${limit}`
  );
  const products = data?.products ? normalizeProducts(data.products) : [];
  return { products, total: data?.total || products.length };
};

export const fetchProductById = async (id) => {
  const data = await fetchWithAuth(`${API_BASE_URL}/products/${id}`);
  return {
    ...data,
    avator: data.avator
      ? `${API_BASE_URL.replace("/api", "")}${data.avator}`
      : null,
  };
};

// ----------------- Orders -----------------
export const fetchOrders = async (page = 1, limit = 10) => {
  const data = await fetchWithAuth(
    `${API_BASE_URL}/orders?page=${page}&limit=${limit}`
  );
  const orders = data?.data ? normalizeOrders(data.data) : [];
  return { orders, total: data?.total || orders.length };
};

export const fetchOrderById = async (id) => {
  const data = await fetchWithAuth(`${API_BASE_URL}/orders/${id}`);
  return { order: data.order, items: data.items };
};

export const createOrder = async (
  accountID,
  items,
  total,
  status = "pending"
) => {
  return fetchWithAuth(`${API_BASE_URL}/orders`, {
    method: "POST",
    body: JSON.stringify({ accountID, items, total, status }),
    headers: { "Content-Type": "application/json" },
  });
};

export const updateOrder = async (id, { total, status }) => {
  return fetchWithAuth(`${API_BASE_URL}/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({ total, status }),
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteOrder = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/orders/${id}`, { method: "DELETE" });
};

// ----------------- Accounts -----------------
export const fetchAccounts = async (page = 1, limit = 10) => {
  const data = await fetchWithAuth(
    `${API_BASE_URL}/accounts?page=${page}&limit=${limit}`
  );
  const users = data?.data ? normalizeUsers(data.data) : [];
  return { users, total: data?.total || users.length };
};

export const fetchAccountById = async (id) => {
  const data = await fetchWithAuth(`${API_BASE_URL}/accounts/${id}`);
  return data || null;
};

export const createAccount = async ({
  name,
  email,
  password,
  role = "user",
}) => {
  return fetchWithAuth(`${API_BASE_URL}/accounts`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
    headers: { "Content-Type": "application/json" },
  });
};

export const updateAccount = async (id, updatedData) => {
  return fetchWithAuth(`${API_BASE_URL}/accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteAccount = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/accounts/${id}`, { method: "DELETE" });
};

// ----------------- Login & Logout -----------------
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/accounts/login`, {
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

export const logout = () => {
  localStorage.removeItem("token");
};

// ----------------- Comments -----------------
export const fetchComments = async (productId) => {
  const url = productId
    ? `${API_BASE_URL}/comments?productID=${productId}`
    : `${API_BASE_URL}/comments`;
  return fetchWithAuth(url);
};

export const postComment = async (productId, content) => {
  return fetchWithAuth(`${API_BASE_URL}/comments`, {
    method: "POST",
    body: JSON.stringify({ productID: productId, content }),
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteComment = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/comments/${id}`, { method: "DELETE" });
};

export const updateComment = async (id, { content }) => {
  return fetchWithAuth(`${API_BASE_URL}/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
    headers: { "Content-Type": "application/json" },
  });
};
