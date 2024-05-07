import ReactPaginate from 'react-paginate';
import MealItem from './MealItem';
import { useState } from 'react';

export default function Paginate({ items, itemsPerPage }) {
  const [itemOffset, setItemOffset] = useState(0);

  function Items({ currentItems }) {
    return (
      <ul id="meals">
        {currentItems.map((meal)=>{
          const newMeal = {
            id: meal['food'].foodId,
            name: meal['food'].label,
            price: meal['food']['nutrients']['ENERC_KCAL'] / 10,
            description: meal['food'].category,
            image: meal['food'].image || "https://assets-v2.lottiefiles.com/a/05359890-1164-11ee-9f09-d76ef2ed5f8e/RGv5qDO9hu.gif"
          }
          return <MealItem key={newMeal.id} meal={newMeal} />
        })}
      </ul>
    );
  }

  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        className='paging'
        pageClassName='button'
        activeClassName='text-button'
      />
    </>
  );
}