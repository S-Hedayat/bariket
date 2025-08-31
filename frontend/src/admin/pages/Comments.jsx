import React, { useEffect, useState, useCallback } from "react";
import CommentModal from "../components/CommentModal"; // کامپوننت Modal جدا

const API_URL = "http://localhost:5000/api/comments";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);

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

  useEffect(() => { fetchComments(); }, [fetchComments]);

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

  const handleSave = async (updatedComment) => {
    try {
      const res = await fetch(`${API_URL}/${updatedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: updatedComment.comment, rating: updatedComment.rating }),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی کامنت");
      setEditingComment(null);
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
                <td className="border p-2">{c.comment}</td>
                <td className="border p-2">{new Date(c.created_at).toLocaleString("fa-IR")}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => setEditingComment(c)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    aria-label={`ویرایش کامنت ${c.accountName}`}
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    aria-label={`حذف کامنت ${c.accountName}`}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingComment && (
        <CommentModal
          comment={editingComment}
          onClose={() => setEditingComment(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Comments;
