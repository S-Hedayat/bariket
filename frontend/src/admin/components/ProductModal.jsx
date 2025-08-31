import React, { useState, useEffect } from "react";

const UPLOAD_URL = "http://localhost:5000/api/products/upload";

const ProductModal = ({ product, categories = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    priceUSD: "",
    categoryID: categories[0]?.id || 1,
    avator: "",
  });

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        brand: product.brand || "",
        model: product.model || "",
        priceUSD: product.priceUSD || "",
        categoryID: product.categoryID || categories[0]?.id || 1,
        avator: product.avator || "",
      });
      setFile(null);
    }
  }, [product, categories]);

  if (!product) return null;

  const handleFileUpload = async () => {
    if (!file) return formData.avator;
    const formDataObj = new FormData();
    formDataObj.append("avator", file);
    try {
      const res = await fetch(UPLOAD_URL, { method: "POST", body: formDataObj });
      if (!res.ok) throw new Error("خطا در آپلود تصویر");
      const data = await res.json();
      return data.filePath || formData.avator;
    } catch (err) {
      console.error(err);
      return formData.avator;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const imagePath = await handleFileUpload();
    try {
      onSave({
        ...formData,
        avator: imagePath,
        categoryID: Number(formData.categoryID) || categories[0]?.id || 1,
        id: product.id,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4 overflow-auto max-h-[90vh]">
        <h2 id="product-modal-title" className="text-xl font-semibold">ویرایش محصول</h2>

        <input
          type="text"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Brand"
        />
        <input
          type="text"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Model"
        />
        <input
          type="number"
          value={formData.priceUSD}
          onChange={(e) => setFormData({ ...formData, priceUSD: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Price"
        />
        <select
          value={formData.categoryID}
          onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded w-full"
        />
        {formData.avator && !file && (
          <img
            src={`http://localhost:5000${formData.avator}`}
            alt={`${formData.brand} ${formData.model}`}
            className="w-24 h-24 object-cover rounded"
            onError={(e) => e.target.style.display = "none"}
          />
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={saving}
            aria-label="لغو و بستن مودال"
          >
            لغو
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={saving}
            aria-label="ذخیره تغییرات محصول"
          >
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductModal);
