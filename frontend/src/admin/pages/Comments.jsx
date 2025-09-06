import React, { useEffect, useState, useCallback } from "react";
import CommentModal from "../components/CommentModal";
import {
  fetchComments as fetchCommentsAPI,
  deleteComment,
  updateComment,
} from "../../site/api"; // ✅ استفاده از API مشترک
import CommentsTable from "../components/CommentsTable";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);

  // 📥 گرفتن کامنت‌ها
  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCommentsAPI();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("خطا در دریافت کامنت‌ها:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // ❌ حذف کامنت
  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    try {
      await deleteComment(id);
      loadComments();
    } catch (err) {
      console.error("خطا در حذف کامنت:", err);
    }
  };

  // ✏️ ذخیره تغییرات کامنت
  const handleSave = async (updatedComment) => {
  try {
    console.log("📌 ارسال برای ویرایش:", updatedComment);
    await updateComment(updatedComment.id, {
      content: updatedComment.content, // 👈 باید content باشه
    });
    setEditingComment(null);
    loadComments();
  } catch (err) {
    console.error("❌ خطا در بروزرسانی کامنت:", err);
    alert(err.message || "خطا در بروزرسانی کامنت");
  }
};


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">مدیریت کامنت‌ها</h1>
      <CommentsTable
        comments={comments}
        loading={loading}
        onDelete={handleDelete}
        onEdit={setEditingComment}
      />
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
