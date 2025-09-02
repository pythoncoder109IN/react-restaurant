import { useContext, useState } from 'react';
import { X, Plus, Minus, Star, Clock, Users, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { currencyFormatter } from '../../util/formatting.js';
import CartContext from '../../store/CartContext.jsx';
import UserProgressContext from '../../store/UserProgressContext.jsx';

export default function MealDetailsModal() {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const meal = userProgressCtx.selectedMeal;
  const isOpen = userProgressCtx.progress === 'meal-details';

  if (!meal) return null;

  // Generate demo data
  const rating = (4 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(50 + Math.random() * 200);
  const cookingTime = Math.floor(15 + Math.random() * 30);
  const servings = Math.floor(1 + Math.random() * 4);
  const calories = Math.floor(200 + Math.random() * 600);

  const ingredients = [
    'Fresh herbs', 'Premium spices', 'Organic vegetables', 
    'High-quality protein', 'Artisanal sauce'
  ];

  const nutritionFacts = [
    { label: 'Calories', value: `${calories} kcal` },
    { label: 'Protein', value: '25g' },
    { label: 'Carbs', value: '35g' },
    { label: 'Fat', value: '12g' },
  ];

  function handleClose() {
    userProgressCtx.hideMealDetails();
    setQuantity(1);
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      cartCtx.addItem(meal);
    }
    toast.success(`Added ${quantity} ${meal.name}${quantity > 1 ? 's' : ''} to cart!`);
    handleClose();
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: meal.name,
        text: meal.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }

  function toggleFavorite() {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content max-w-4xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Action Buttons */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={toggleFavorite}
                  className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-4 right-4 bg-primary-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                {currencyFormatter.format(meal.price)}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Title and Rating */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{meal.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{rating}</span>
                    <span>({reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{cookingTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{servings} serving{servings > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{meal.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Ingredients</h3>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2 text-gray-600">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition Facts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition Facts</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {nutritionFacts.map((fact, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">{fact.label}</div>
                        <div className="font-semibold text-gray-900">{fact.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className="btn-primary text-lg px-8 py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add {quantity} to Cart - {currencyFormatter.format(meal.price * quantity)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}