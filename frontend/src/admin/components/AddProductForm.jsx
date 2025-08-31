import React, { useState, useEffect, useCallback, useMemo } from "react";

const API_URL = "http://localhost:5000/api/products";
const UPLOAD_URL = "http://localhost:5000/api/products/upload";

const AddProductForm = ({ setProducts, setTotal, categories }) => {
  const [newProduct, setNewProduct] = useState({
    brand: "",
    model: "",
    priceUSD: "",
    categoryID: "",
    avator: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 📸 انتخاب فایل
  const handleFileChange = useCallback((e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }, []);

  // آزاد کردن حافظه
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 📤 آپلود فایل
  const handleFileUpload = useCallback(async () => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("avator", file);
    try {
      const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();
      return data.filePath ? `http://localhost:5000${data.filePath}` : "";
    } catch (err) {
      console.error(err);
      return "";
    }
  }, [file]);

  // ➕ افزودن محصول
  const handleAddProduct = useCallback(async (e) => {
    e.preventDefault();
    try {
      const imagePath = file ? await handleFileUpload() : "";
      const payload = {
        ...newProduct,
        avator: imagePath,
        priceUSD: Number(newProduct.priceUSD),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در افزودن محصول");

      setProducts((prev) => [{ ...payload, id: data.id, updatedAt: Date.now() }, ...prev]);
      setTotal((prev) => prev + 1);
      setNewProduct({ brand: "", model: "", priceUSD: "", categoryID: "", avator: "" });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "خطا در افزودن محصول");
    }
  }, [newProduct, file, handleFileUpload, setProducts, setTotal]);

  // 🔹 Category options memoized
  const categoryOptions = useMemo(
    () => categories.map((c) => (
      <option key={c.id} value={c.id}>{c.name}</option>
    )),
    [categories]
  );

  return (
    <form
      onSubmit={handleAddProduct}
      className="p-4 border rounded-lg bg-white shadow space-y-3"
    >
      <h2 className="text-xl font-semibold">افزودن محصول جدید</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label htmlFor="brand" className="sr-only">Brand</label>
          <input
            id="brand"
            type="text"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="model" className="sr-only">Model</label>
          <input
            id="model"
            type="text"
            placeholder="Model"
            value={newProduct.model}
            onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="sr-only">Price</label>
          <input
            id="price"
            type="number"
            placeholder="Price"
            value={newProduct.priceUSD}
            onChange={(e) => setNewProduct({ ...newProduct, priceUSD: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="sr-only">دسته‌بندی</label>
          <select
            id="category"
            value={newProduct.categoryID}
            onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categoryOptions}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="productImage" className="block mb-1">تصویر محصول</label>
        <input
          id="productImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        {preview && (
          <img
            src={preview}
            alt="پیش‌نمایش تصویر محصول"
            className="w-32 h-32 object-cover rounded mt-2"
          />
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        افزودن
      </button>
    </form>
  );
};

export default React.memo(AddProductForm);
