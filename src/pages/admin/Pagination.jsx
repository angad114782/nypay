import React from "react";

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  if (totalPages === 0) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded border text-sm disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-2 py-1 rounded border text-sm ${
              currentPage === i + 1
                ? "bg-[#8AAA08] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded border text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
