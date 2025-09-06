import React, { useMemo } from "react";
import { Trash2, Edit, Eye } from "lucide-react";

const CommentsTable = ({ comments, loading, onDelete, onEdit, onView }) => {
  // Memoize rows to avoid unnecessary re-renders
  const rows = useMemo(() => {
    return comments.map((c, idx) => {
      const commentText = c.content || "";

      return (
        <tr key={c.id} className="border-b hover:bg-gray-50">
          <td className="p-2 text-center">{idx + 1}</td>
          <td className="p-2 text-center">{c.accountName}</td>
          <td className="p-2 text-center">{c.productBrand} {c.productModel}</td>
          <td className="p-2">{commentText} </td>
          <td className="p-2 text-center">
            {new Date(c.created_at).toLocaleString("fa-IR")}
          </td>
          <td className="p-2 text-center space-x-2">
            <button
              onClick={() => onEdit(c)}
              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              aria-label={`ویرایش کامنت ${c.accountName}`}
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(c.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              aria-label="حذف کامنت"
            >
              <Trash2 size={18} />
            </button>
          </td>
        </tr>
      );
    });
  }, [comments, onView, onEdit, onDelete]);

  return (
    <div className="border rounded-lg shadow bg-white overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">کاربر</th>
            <th className="p-2 border">محصول</th>
            <th className="p-2 border">کامنت</th>
            <th className="p-2 border">تاریخ</th>
            <th className="p-2 border">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-3 text-center text-gray-500">
                در حال بارگذاری...
              </td>
            </tr>
          ) : comments.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-3 text-center text-gray-500">
                هیچ کامنتی وجود ندارد.
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(CommentsTable);
