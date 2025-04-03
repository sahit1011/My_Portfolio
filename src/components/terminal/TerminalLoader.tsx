'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TerminalLoader: React.FC = () => {
  return (
    <div className="w-full h-[65vh] flex items-center justify-center bg-gray-900 rounded-lg shadow-2xl border border-gray-800">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-2xl text-white mb-4">Loading Terminal...</div>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        <div className="mt-4 text-gray-400">
          <p>Initializing environment...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TerminalLoader;
