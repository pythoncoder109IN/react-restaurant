import { useContext, useMemo } from 'react';
import { Plus, Star, Clock, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { currencyFormatter } from '../util/formatting.js';
import CartContext from '../store/CartContext.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';

export default function MealItem({ meal, index }) {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  // Generate consistent data based on meal ID to prevent regeneration
  const mealStats = useMemo(() => {
    const seed = meal.id ? meal.id.toString() : meal.name;
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return {
      rating: (4 + (Math.abs(hash) % 100) / 100).toFixed(1),
      cookingTime: 15 + (Math.abs(hash) % 30),
      servings: 1 + (Math.abs(hash) % 4),
      calories: 200 + (Math.abs(hash) % 600)
    };
  }, [meal.id, meal.name]);

  function handleShowMealDetails(e) {
    e.stopPropagation();
    userProgressCtx.showMealDetails(meal);
  }

  function handleAddMealToCart(e) {
    e.stopPropagation();
    cartCtx.addItem(meal);
    toast.success(`Added ${meal.name} to cart!`, {
      icon: '🍽️',
    });
  }

  return (
    <motion.li
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="card h-full flex flex-col">
        <div className="relative overflow-hidden">
          <motion.img
            src={meal.image}
            alt={meal.name}
            className="w-full h-48 sm:h-56 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* View Details Button */}
          <motion.button
            onClick={handleShowMealDetails}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5" />
          </motion.button>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{mealStats.rating}</span>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
            {currencyFormatter.format(meal.price)}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
              {meal.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {meal.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{mealStats.cookingTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{mealStats.servings} serving{mealStats.servings > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <motion.button
              onClick={handleShowMealDetails}
              className="flex-1 btn-secondary text-sm py-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
            <motion.button
              onClick={handleAddMealToCart}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 text-sm py-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}