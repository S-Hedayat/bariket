const API_URL = "http://localhost:5000/api";

// ----------------- Products -----------------
export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
};

// ----------------- Comments -----------------
export const fetchComments = async (productId) => {
  const res = await fetch(`${API_URL}/comments?productID=${productId}`);
  return res.json();
};

export const postComment = async (productId, content, accountID) => {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productID: productId, content, accountID }),
  });
  return res.json();
};

// ----------------- Accounts (Profile) -----------------
export const fetchAccountById = async (id) => {
  const res = await fetch(`${API_URL}/accounts/${id}`);
  return res.json();
};

export const updateAccount = async (id, data) => {
  const res = await fetch(`${API_URL}/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
// ----------------- Orders -----------------
export const createOrder = async (accountID, items, total) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountID, items, total }),
  });
  return res.json();
};
// ----------------- Login -----------------
export const login = async (email, password) => {
  const res = await fetch("http://localhost:5000/api/accounts/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }
  return res.json();
};

