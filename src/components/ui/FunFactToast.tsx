'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaTimes, FaBan } from 'react-icons/fa';
import { useFunFact } from '@/context/FunFactContext';

const FunFactToast: React.FC = () => {
  const { currentFact, showFact, dismissFact, disableAllFacts } = useFunFact();

  if (!currentFact) return null;

  return (
    <AnimatePresence>
      {showFact && (
        <motion.div
          initial={{ opacity: 0, x: 50, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-1/3 right-4 w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          role="alert"
          aria-live="polite"
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaLightbulb className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Did you know?</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-normal">{currentFact.text}</p>
                <div className="mt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={dismissFact}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    <FaTimes className="mr-1 h-3 w-3" aria-hidden="true" />
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={disableAllFacts}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none"
                  >
                    <FaBan className="mr-1 h-3 w-3" aria-hidden="true" />
                    Don&apos;t show again
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 animate-shrink" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FunFactToast;
