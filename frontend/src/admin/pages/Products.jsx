import React, { useEffect, useState, useCallback } from "react";
import ProductsTable from "../components/ProductsTable";
import ProductModal from "../components/ProductModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

const API_URL = "http://localhost:5000/api/products";
const CATEGORIES_URL = "http://localhost:5000/api/categories";
const UPLOAD_URL = "http://localhost:5000/api/products/upload";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // تعداد آیتم در هر صفحه

  const [newProduct, setNewProduct] = useState({ brand:"", model:"", priceUSD:"", categoryID:"", avator:"" });
  const [file, setFile] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // ---------- Fetch products ----------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?offset=${(page - 1) * limit}&limit=${limit}`);
      const data = await res.json();

      // تضمین اینکه products همیشه آرایه باشد
      const productsArray = Array.isArray(data.products) ? data.products : [];
      setProducts(productsArray);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("خطا در گرفتن محصولات:", err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // ---------- Fetch categories ----------
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(CATEGORIES_URL);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("خطا در گرفتن دسته‌بندی‌ها:", err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ---------- Upload file ----------
  const handleFileUpload = async () => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("avator", file);
    try {
      const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();
      return data.filePath || "";
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  // ---------- Add new product ----------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const imagePath = await handleFileUpload();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, avator: imagePath }),
      });
      if (!res.ok) throw new Error("خطا در افزودن محصول");
      setPage(1); // بعد از اضافه کردن، صفحه اول را نمایش بده
      await fetchProducts();
      setNewProduct({ brand:"", model:"", priceUSD:"", categoryID:"", avator:"" });
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Delete product ----------
  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف محصول");
      await fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Edit product ----------
  const handleEditSave = async (updated) => {
    try {
      const res = await fetch(`${API_URL}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی محصول");
      await fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">مدیریت محصولات</h1>
      <p className="text-gray-600">تعداد کل محصولات: {total}</p>

      {/* ---------- Add product form ---------- */}
      <form onSubmit={handleAddProduct} className="p-4 border rounded-lg bg-white shadow space-y-3">
        <h2 className="text-xl font-semibold">افزودن محصول جدید</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="text" placeholder="Brand" value={newProduct.brand} onChange={e=>setNewProduct({...newProduct, brand:e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Model" value={newProduct.model} onChange={e=>setNewProduct({...newProduct, model:e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Price" value={newProduct.priceUSD} onChange={e=>setNewProduct({...newProduct, priceUSD:e.target.value})} className="border p-2 rounded" required />
          <select value={newProduct.categoryID} onChange={e=>setNewProduct({...newProduct, categoryID:e.target.value})} className="border p-2 rounded" required>
            <option value="">انتخاب دسته‌بندی</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} className="border p-2 rounded w-full"/>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">افزودن</button>
      </form>

      {/* ---------- Products table ---------- */}
      <ProductsTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onEdit={setEditingProduct}
        onView={setViewingProduct}
      />

      {/* ---------- Pagination ---------- */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          قبلی
        </button>
        <span>صفحه {page} از {Math.ceil(total / limit)}</span>
        <button
          onClick={() => setPage(prev => (prev < Math.ceil(total / limit) ? prev + 1 : prev))}
          disabled={page >= Math.ceil(total / limit)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          بعدی
        </button>
      </div>

      {/* ---------- Edit modal ---------- */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={()=>setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}

      {/* ---------- View details modal ---------- */}
      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={()=>setViewingProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
