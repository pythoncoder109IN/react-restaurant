import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
            nextLabel={
              <div className="flex items-center space-x-1">
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            previousLabel={
              <div className="flex items-center space-x-1">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </div>
            }
            renderOnZeroPageCount={null}
            className="flex items-center space-x-2"
            pageClassName="page-item"
            pageLinkClassName="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 cursor-pointer font-medium"
            activeClassName="selected"
            activeLinkClassName="bg-primary-500 text-white border-primary-500 hover:bg-primary-600"
            disabledClassName="disabled"
            disabledLinkClassName="text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400 hover:border-gray-200"
            breakClassName="page-item"
            breakLinkClassName="px-3 py-2 text-gray-400"
            nextClassName="page-item"
            nextLinkClassName="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 cursor-pointer font-medium flex items-center space-x-1"
            previousClassName="page-item"
            previousLinkClassName="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 cursor-pointer font-medium flex items-center space-x-1"
          />
        </motion.div>
      )}
    </div>
  );
}