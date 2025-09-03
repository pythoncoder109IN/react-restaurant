import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const popularSearches = [
  'Pizza', 'Burger', 'Pasta', 'Salad', 'Chicken', 'Seafood', 'Dessert', 'Soup'
];

const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      toast.error('Please enter a search term');
      return;
    }
    performSearch(searchTerm.trim());
  }

  function performSearch(term) {
    // Save to recent searches
    const updatedRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    
    navigate(`/search/${encodeURIComponent(term)}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.blur();
  }

  function clearSearch() {
    setSearchTerm('');
    inputRef.current?.focus();
  }

  function handleFocus() {
    setIsFocused(true);
    setShowSuggestions(true);
  }

  function clearRecentSearches() {
    localStorage.removeItem('recentSearches');
    setShowSuggestions(false);
  }

  const filteredPopular = popularSearches.filter(search => 
    search.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRecentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <motion.input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search for delicious dishes..."
            className={`
              w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 bg-white
              ${isFocused 
                ? 'border-primary-300 ring-2 ring-primary-100 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }
              focus:outline-none placeholder-gray-400
            `}
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          {searchTerm && (
            <motion.button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </form>
      
      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3">
              {/* Search for current term */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => performSearch(searchTerm)}
                  className="w-full text-left px-3 py-2 hover:bg-primary-50 rounded-lg transition-colors duration-200 flex items-center space-x-2 mb-2"
                >
                  <Search className="h-4 w-4 text-primary-500" />
                  <span className="text-gray-700">Search for "<span className="font-medium">{searchTerm}</span>"</span>
                </button>
              )}

              {/* Recent Searches */}
              {currentRecentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Recent</span>
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      Clear
                    </button>
                  </div>
                  {currentRecentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => performSearch(search)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Popular</span>
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {(searchTerm ? filteredPopular : popularSearches).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => performSearch(search)}
                      className="text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-sm text-gray-600"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}