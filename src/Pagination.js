import React from 'react'

const Pagination = ({postsPerPage, totalPosts, paginate, currentPage}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className='w-full'>
        <ul className='pagination flex justify-center gap-4 mt-5'>
            {pageNumbers.map(number => (
                <li onClick={() => paginate(number)} key={number} className={`page-item cursor-pointer hover:bg-neutral-700 hover:text-orange-300 transition-all rounded-xl bg-neutral-800 w-[40px] text-center py-2 text-white ${number === currentPage ? 'scale-125 text-orange-400 font-bold' : ''}`}>
                    <a className='page-link'>{number}</a>
                </li>
            ))}
        </ul>
    </nav>
  )
}

export default Pagination;

