import React from "react";
import { Trash2, Edit, Eye } from "lucide-react";

const UsersTable = ({ users, loading, onDelete, onEdit, onView }) => {

  // تعداد ردیف Skeleton که نشان داده می‌شود هنگام loading
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="border rounded-lg shadow bg-white">
      <div className="flex justify-between p-3 font-bold bg-gray-100">
        <span>کاربران ({users.length})</span>
      </div>

      <div>
        {loading
          ? (
            <div className="space-y-3 p-3">
              {skeletonRows.map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b bg-gray-200 rounded animate-pulse">
                  <div className="bg-gray-300 rounded h-4 w-32">&nbsp;</div>
                  <div className="flex gap-2">
                    <div className="bg-gray-300 rounded h-6 w-6">&nbsp;</div>
                    <div className="bg-gray-300 rounded h-6 w-6">&nbsp;</div>
                    <div className="bg-gray-300 rounded h-6 w-6">&nbsp;</div>
                  </div>
                </div>
              ))}
            </div>
          )
          : (
            users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border-b">
                {/* Skeleton fallback داخلی هر ردیف برای LCP سریع */}
                <div>
                  {user.name ? (
                    <>
                      <span className="font-semibold text-gray-700">{user.name}</span>
                      <span className="text-gray-500 text-sm ml-2">{user.email}</span>
                    </>
                  ) : (
                    <div className="bg-gray-200 rounded animate-pulse h-4 w-32">&nbsp;</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onView(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  );
};

export default React.memo(UsersTable);
