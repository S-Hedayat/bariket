import React from "react";

const CommentList = ({ comments }) => {
  return (
    <div className="mt-2">
      {comments.map((c) => (
        <div key={c.id} className="border-b py-2">
          <p className="text-gray-800">{c.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
