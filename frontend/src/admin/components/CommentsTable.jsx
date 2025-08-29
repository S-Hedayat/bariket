import React from "react";
import { Trash2, Edit, Eye } from "lucide-react";

const CommentsTable = ({ comments, loading, onDelete, onEdit, onView }) => {
  return (
    <div className="border rounded-lg shadow bg-white">
      <div className="flex justify-between p-3 font-bold bg-gray-100">
        <span>کامنت‌ها ({comments.length})</span>
      </div>

      <div>
        {loading ? (
          <div className="p-3 text-center text-gray-500">در حال بارگذاری...</div>
        ) : (
          comments.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <span className="font-semibold">{c.userName}</span> برای <span className="font-semibold">{c.productBrand} {c.productModel}</span>
                <div className="text-gray-500 text-sm">{c.comment} (رتبه: {c.rating})</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onView(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye size={20} /></button>
                <button onClick={() => onEdit(c)} className="p-2 text-green-600 hover:bg-green-50 rounded"><Edit size={20} /></button>
                <button onClick={() => onDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsTable;
