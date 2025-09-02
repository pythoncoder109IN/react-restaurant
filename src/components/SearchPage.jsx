import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Filter, SortAsc, Search, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

import useHttp from "../hooks/useHttp";
import Error from "./Error";
import LoadingSpinner from "./UI/LoadingSpinner";
import Paginate from "./Paginate";

const requestConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function SearchPage() {
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();
  const { dishName } = useParams();
  
  const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${dishName}&app_id=${
    import.meta.env.VITE_APP_ID
  }&app_key=${import.meta.env.VITE_APP_KEY}`;
  
  const { data, isLoading, error } = useHttp(url, requestConfig, []);

  let loadedMeals = [];

  if (data?.hints) {
    loadedMeals = data.hints;
    
    // Apply sorting
    if (sortBy === 'name') {
      loadedMeals.sort((a, b) => a.food.label.localeCompare(b.food.label));
    } else if (sortBy === 'calories') {
      loadedMeals.sort((a, b) => (b.food.nutrients?.ENERC_KCAL || 0) - (a.food.nutrients?.ENERC_KCAL || 0));
    }

    // Apply filtering
    if (filterBy !== 'all') {
      loadedMeals = loadedMeals.filter(meal => 
        meal.food.category?.toLowerCase().includes(filterBy.toLowerCase())
      );
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="btn-ghost flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary-100 p-2 rounded-lg">
            <Search className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results for "{dishName}"
            </h1>
            <p className="text-gray-600">
              Found {loadedMeals.length} delicious option{loadedMeals.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="vegetable">Vegetables</option>
                <option value="fruit">Fruits</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="name">Sort by Name</option>
              <option value="calories">Sort by Calories</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {loadedMeals.length > 0 ? (
        <Paginate items={loadedMeals} itemsPerPage={12} />
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No results found</h3>
          <p className="text-gray-400 mb-6">
            We couldn't find any dishes matching "{dishName}". Try searching for something else!
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary"
          >
            Browse All Dishes
          </button>
        </motion.div>
      )}
    </div>
  );
}