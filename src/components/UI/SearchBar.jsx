import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      return;
    }
    navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  }

  function clearSearch() {
    setSearchTerm('');
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <motion.input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
      
      {/* Search suggestions could be added here */}
      <AnimatePresence>
        {isFocused && searchTerm && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3">
              <button
                type="submit"
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Search for "{searchTerm}"</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}