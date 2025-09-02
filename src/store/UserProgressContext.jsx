import { createContext, useState } from 'react';

const UserProgressContext = createContext({
  progress: '', // 'cart', 'checkout', 'meal-details'
  selectedMeal: null,
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
  showMealDetails: (meal) => {},
  hideMealDetails: () => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);

  function showCart() {
    setUserProgress('cart');
  }

  function hideCart() {
    setUserProgress('');
  }

  function showCheckout() {
    setUserProgress('checkout');
  }

  function hideCheckout() {
    setUserProgress('');
  }

  function showMealDetails(meal) {
    setSelectedMeal(meal);
    setUserProgress('meal-details');
  }

  function hideMealDetails() {
    setSelectedMeal(null);
    setUserProgress('');
  }

  const userProgressCtx = {
    progress: userProgress,
    selectedMeal,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
    showMealDetails,
    hideMealDetails,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;