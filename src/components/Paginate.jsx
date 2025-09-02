import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { motion } from 'framer-motion';

import MealItem from './MealItem';

export default function Paginate({ items, itemsPerPage }) {
  const [itemOffset, setItemOffset] = useState(0);

  function Items({ currentItems }) {
    return (
      <motion.ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentItems.map((meal, index) => {
          const newMeal = {
            id: meal['food'].foodId,
            name: meal['food'].label,
            price: Math.max(5, Math.floor(meal['food']['nutrients']['ENERC_KCAL'] / 10)) || 15,
            description: meal['food'].category || 'Delicious and nutritious dish prepared with care',
            image: meal['food'].image || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
          };
          return <MealItem key={newMeal.id} meal={newMeal} index={index} />;
        })}
      </motion.ul>
    );
  }

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Items currentItems={currentItems} />
      {pageCount > 1 && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next →"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            previousLabel="← Previous"
            renderOnZeroPageCount={null}
            className="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="selected"
            disabledClassName="disabled"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
          />
        </motion.div>
      )}
    </div>
  );
}