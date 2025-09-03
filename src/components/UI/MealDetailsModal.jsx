import { useContext, useState, useMemo } from 'react';
import { X, Plus, Minus, Star, Clock, Users, Heart, Share2, ShoppingCart } from 'lucide-react';
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

  // Generate consistent data based on meal ID
  const mealData = useMemo(() => {
    if (!meal) return null;
    
    const seed = meal.id ? meal.id.toString() : meal.name;
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const absHash = Math.abs(hash);
    
    return {
      rating: (4 + (absHash % 100) / 100).toFixed(1),
      reviewCount: 50 + (absHash % 200),
      cookingTime: 15 + (absHash % 30),
      servings: 1 + (absHash % 4),
      calories: 200 + (absHash % 600),
      ingredients: [
        'Fresh herbs', 'Premium spices', 'Organic vegetables', 
        'High-quality protein', 'Artisanal sauce'
      ],
      nutritionFacts: [
        { label: 'Calories', value: `${200 + (absHash % 600)} kcal` },
        { label: 'Protein', value: `${15 + (absHash % 20)}g` },
        { label: 'Carbs', value: `${25 + (absHash % 30)}g` },
        { label: 'Fat', value: `${8 + (absHash % 15)}g` },
      ]
    };
  }, [meal]);

  if (!meal || !mealData) return null;

  function handleClose() {
    userProgressCtx.hideMealDetails();
    setQuantity(1);
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      cartCtx.addItem(meal);
    }
    toast.success(`Added ${quantity} ${meal.name}${quantity > 1 ? 's' : ''} to cart!`, {
      icon: '🛒',
    });
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
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites', {
      icon: isFavorite ? '💔' : '❤️',
    });
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
                    <span className="font-medium">{mealData.rating}</span>
                    <span>({mealData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{mealData.cookingTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{mealData.servings} serving{mealData.servings > 1 ? 's' : ''}</span>
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
                    {mealData.ingredients.map((ingredient, index) => (
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
                    {mealData.nutritionFacts.map((fact, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">{fact.label}</div>
                        <div className="font-semibold text-gray-900">{fact.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-900">Quantity:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-xl font-bold text-primary-600">
                      {currencyFormatter.format(meal.price * quantity)}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add {quantity} to Cart</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}