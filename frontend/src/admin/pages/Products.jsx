import React, { useEffect, useState, useCallback, useMemo } from "react";
import ProductsVirtualTable from "../components/ProductsTable";
import ProductModal from "../components/ProductModal";
import ProductDetailsModal from "../components/ProductDetailsModal";
import AddProductForm from "../components/AddProductForm";

const API_URL = "http://localhost:5000/api/products";
const CATEGORIES_URL = "http://localhost:5000/api/categories";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // 📥 گرفتن محصولات
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
      const data = await res.json();
      const productsWithFullPath = (Array.isArray(data.products) ? data.products : []).map(
        (p) => ({
          ...p,
          updatedAt: p.updatedAt || Date.now(),
          avator: p.avator ? `http://localhost:5000${p.avator}` : null,
        })
      );
      setProducts(productsWithFullPath);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // 📥 گرفتن دسته‌بندی‌ها
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(CATEGORIES_URL);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ❌ حذف محصول
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف محصول");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ✏️ ذخیره تغییرات محصول
  const handleEditSave = useCallback(async (updated, fileUpdated = null) => {
    try {
      let imagePath = updated.avator;
      if (fileUpdated) {
        const formData = new FormData();
        formData.append("avator", fileUpdated);
        const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
        const data = await res.json();
        imagePath = data.filePath ? `http://localhost:5000${data.filePath}` : "";
      }

      const payload = {
        ...updated,
        avator: imagePath,
        priceUSD: Number(updated.priceUSD),
      };

      const res = await fetch(`${API_URL}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی محصول");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === updated.id ? { ...payload, updatedAt: Date.now() } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 📊 صفحه‌بندی
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">لیست محصولات</h2>
      <p className="text-gray-600">تعداد کل محصولات: {total}</p>

      {/* فرم افزودن محصول */}
      <AddProductForm setProducts={setProducts} setTotal={setTotal} categories={categories} />

      {/* جدول محصولات */}
      <ProductsVirtualTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onEdit={setEditingProduct}
        onView={setViewingProduct}
      />

      {/* صفحه‌بندی */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          قبلی
        </button>
        <span>
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          بعدی
        </button>
      </div>

      {/* مودال‌ها */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}
      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
