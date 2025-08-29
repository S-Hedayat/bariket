import React, { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api/comments";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف کامنت");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${API_URL}/${editingComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedContent }),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی کامنت");
      setEditingComment(null);
      setUpdatedContent("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">مدیریت کامنت‌ها</h1>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : comments.length === 0 ? (
        <p>هیچ کامنتی وجود ندارد.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">کاربر</th>
              <th className="border p-2">محصول</th>
              <th className="border p-2">کامنت</th>
              <th className="border p-2">تاریخ</th>
              <th className="border p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c, idx) => (
              <tr key={c.id}>
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{c.accountName}</td>
                <td className="border p-2">{c.productBrand} - {c.productModel}</td>
                <td className="border p-2">{c.content}</td>
                <td className="border p-2">{new Date(c.created_at).toLocaleString()}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditingComment(c);
                      setUpdatedContent(c.content);
                    }}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------- Edit Modal ---------- */}
      {editingComment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">ویرایش کامنت</h2>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingComment(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                لغو
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
