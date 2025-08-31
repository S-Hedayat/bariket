import React from "react";
import { Trash2, Edit, Eye } from "lucide-react";

const UsersTable = ({ users, loading, onDelete, onEdit, onView }) => {
  return (
    <div className="border rounded-lg shadow bg-white">
      <div className="flex justify-between p-3 font-bold bg-gray-100">
        <span>کاربران ({users.length})</span>
      </div>

      <div>
        {loading ? (
          <div className="p-3 text-center text-gray-500">در حال بارگذاری...</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <span className="font-semibold text-gray-700">{user.name}</span>
                <span className="text-gray-500 text-sm ml-2">{user.email}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  aria-label={`مشاهده ${user.name}`}
                  title="مشاهده"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  aria-label={`ویرایش ${user.name}`}
                  title="ویرایش"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  aria-label={`حذف ${user.name}`}
                  title="حذف"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(UsersTable);
