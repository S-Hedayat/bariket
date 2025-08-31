import React, { useState, useEffect, useCallback } from "react";

const CommentModal = ({ comment, onClose, onSave, readOnly = false }) => {
  const [formData, setFormData] = useState({
    comment: "",
    rating: 5,
  });

  useEffect(() => {
    if (comment) {
      setFormData({
        comment: comment.comment || "",
        rating: comment.rating ?? 5,
      });
    }
  }, [comment]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSave) onSave({ ...comment, ...formData });
    onClose();
  }, [onSave, onClose, comment, formData]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold">{readOnly ? "مشاهده کامنت" : "ویرایش کامنت"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="comment" className="sr-only">متن کامنت</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="متن کامنت"
              className="border p-2 rounded w-full"
              rows={4}
              required
              disabled={readOnly}
            />
          </div>

          <div>
            <label htmlFor="rating" className="sr-only">امتیاز</label>
            <input
              id="rating"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min={1}
              max={5}
              className="border p-2 rounded w-full"
              disabled={readOnly}
            />
          </div>

          {!readOnly && (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              ذخیره تغییرات
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default React.memo(CommentModal);
