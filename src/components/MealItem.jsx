import { useContext } from 'react';
import { Plus, Star, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { currencyFormatter } from '../util/formatting.js';
import CartContext from '../store/CartContext.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';

export default function MealItem({ meal, index }) {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  function handleShowMealDetails() {
    userProgressCtx.showMealDetails(meal);
  }

  function handleAddMealToCart(e) {
    e.stopPropagation();
    cartCtx.addItem(meal);
  }

  // Generate random ratings and cooking time for demo
  const rating = (4 + Math.random()).toFixed(1);
  const cookingTime = Math.floor(15 + Math.random() * 30);
  const servings = Math.floor(1 + Math.random() * 4);

  return (
    <motion.li
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={handleShowMealDetails}
    >
      <div className="card h-full">
        <div className="relative overflow-hidden">
          <motion.img
            src={meal.image}
            alt={meal.name}
            className="w-full h-48 sm:h-56 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Add Button */}
          <motion.button
            onClick={handleAddMealToCart}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-primary-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
              {meal.name}
            </h3>
            <span className="text-2xl font-bold text-primary-600 ml-2">
              {currencyFormatter.format(meal.price)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {meal.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{cookingTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{servings} serving{servings > 1 ? 's' : ''}</span>
            </div>
          </div>

          <motion.button
            onClick={handleAddMealToCart}
            className="w-full btn-primary flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.li>
  );
}