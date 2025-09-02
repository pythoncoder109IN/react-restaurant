import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';

import MealItem from './MealItem.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';
import LoadingSpinner from './UI/LoadingSpinner.jsx';

const requestConfig = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp(`${import.meta.env.VITE_BACKEND_URL}/meals`, requestConfig, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <ChefHat className="w-8 h-8 text-primary-500" />
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4">
          Our <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Signature</span> Dishes
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Crafted with passion, served with love. Discover our carefully curated selection of gourmet meals.
        </p>
      </motion.div>

      {/* Meals Grid */}
      <motion.ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loadedMeals.map((meal, index) => (
          <MealItem key={meal.id} meal={meal} index={index} />
        ))}
      </motion.ul>

      {loadedMeals.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No meals available</h3>
          <p className="text-gray-400">Check back later for our delicious offerings!</p>
        </motion.div>
      )}
    </div>
  );
}