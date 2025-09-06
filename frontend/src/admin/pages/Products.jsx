// frontend/src/pages/Products.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductsVirtualTable from "../components/ProductsTable";
import ProductModal from "../components/ProductModal";
import ProductDetailsModal from "../components/ProductDetailsModal";
import AddProductForm from "../components/AddProductForm";
import { fetchProducts } from "../../site/api";

const PRODUCTS_PER_PAGE = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts(page, PRODUCTS_PER_PAGE);
      setProducts(data.products || []);
      setTotal(data.total || (data.products || []).length);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotal(0);
    }
  }, [page]);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف محصول");
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleEditSave = useCallback(async (updated, fileUpdated = null) => {
    try {
      let imagePath = updated.avator;
      if (fileUpdated) {
        const formData = new FormData();
        formData.append("avator", fileUpdated);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/upload`, { method: "POST", body: formData });
        const data = await res.json();
        imagePath = data.filePath
          ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${data.filePath}?t=${Date.now()}`
          : "";
      }

      const payload = { ...updated, avator: imagePath, priceUSD: Number(updated.priceUSD) };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی محصول");

      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id || p._id === updated.id ? { ...payload, updatedAt: Date.now() } : p))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const totalPages = useMemo(() => Math.ceil(total / PRODUCTS_PER_PAGE), [total]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">لیست محصولات</h2>
      <p className="text-gray-600">تعداد کل محصولات: {total}</p>

      <AddProductForm setProducts={setProducts} setTotal={setTotal} categories={categories} />

      <ProductsVirtualTable
        products={products}
        onDelete={handleDelete}
        onEdit={setEditingProduct}
        onView={setViewingProduct}
      />

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          قبلی
        </button>
        <span>صفحه {page} از {totalPages}</span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          بعدی
        </button>
      </div>

      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}

      {viewingProduct && (
        <ProductDetailsModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}
    </div>
  );
};

export default Products;
