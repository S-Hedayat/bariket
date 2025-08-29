import React from "react";

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        قبلی
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        بعدی
      </button>
    </div>
  );
};

export default Pagination;
