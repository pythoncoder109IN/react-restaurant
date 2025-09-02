import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({ title, message, onRetry }) {
  return (
    <motion.div
      className="max-w-md mx-auto text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-red-50 border border-red-200 rounded-xl p-8">
        <motion.div
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <AlertCircle className="w-8 h-8 text-red-600" />
        </motion.div>
        
        <h2 className="text-xl font-bold text-red-800 mb-2">{title}</h2>
        <p className="text-red-600 mb-6">{message}</p>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="btn-secondary flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}