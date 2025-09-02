import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-primary-500" />
        </div>
      </motion.div>
      <motion.p
        className="text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Preparing your culinary experience...
      </motion.p>
    </div>
  );
}