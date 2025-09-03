import { useContext, useState } from 'react';
import { ShoppingCart, Menu, X, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CartContext from '../store/CartContext.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import SearchBar from './UI/SearchBar.jsx';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <UtensilsCrossed className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Delicious
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Fine Dining Experience</p>
            </div>
          </motion.div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Desktop Cart Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
              onClick={handleShowCart}
              className="relative flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {totalCartItems}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-100 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <SearchBar />
                <button
                  onClick={handleShowCart}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({totalCartItems})</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}