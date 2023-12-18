
import React from 'react';



const Pagination = ({
  currentPage,
  handlePageClick,
  handlePreviousPage,
  handleNextPage,
  pageRange,
  totalPages,
  endIndex
}: {
  currentPage: number;
  handlePageClick: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  pageRange: number[];
  totalPages: number;
  endIndex: number;
}) => {
  return (
    <div className="flex justify-center mt-4 p-2 md:gap-10 items-center ">
      {pageRange.map((page) => (
        <button
          key={page}
          onClick={() => {
            console.log('Clicked on page:', page);
            handlePageClick(page);
          }}
          className={currentPage === page ? 'flex items-center justify-center bg-green-400 p-3 rounded-3xl text-zinc-700' : ''}
        >
          {page}
        </button>
      ))}

      <button onClick={handlePreviousPage} disabled={currentPage === 1} className="border p-2 rounded-xl disabled:bg-slate-200">
        Previous
      </button>
      <span className="mx-2">{`${currentPage} of ${totalPages}`}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="border p-2 rounded-xl">
        Next
      </button>
    </div>

  );

};

export default Pagination;
