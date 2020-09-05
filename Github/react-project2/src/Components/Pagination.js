import React from "react";
const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumber = [];
  for (let i = 1; i <= Math.round(totalPosts / postsPerPage); i++) {
    pageNumber.push(i);
  }
  return (
    <ul className="nav">
      {pageNumber.map((number) => (
        <li key={number} className="page-item">
          <button onClick={() => paginate(number)} className="page-link">
            {number}
          </button>
        </li>
      ))}
    </ul>
  );
};
export default Pagination;
