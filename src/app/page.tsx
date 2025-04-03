'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Import Terminal component dynamically with SSR disabled
const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  ssr: false,
});

export default function Home() {
  // States for handling loading and mounting
  const [mounted, setMounted] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('hasLoaded') === 'true';

      if (!hasLoaded) {
        // First load - set the flag and show loading screen
        sessionStorage.setItem('hasLoaded', 'true');

        // Auto-refresh after a delay
        const timer = setTimeout(() => {
          window.location.reload();
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        // Not the first load, so we can render normally
        setInitialLoad(false);
        setMounted(true);
        console.log('Home component mounted on client');
      }
    }
  }, []);

  // Show loading screen on initial load
  if (initialLoad) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 z-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-4xl font-bold mb-6 text-white">
            <span className="text-blue-500">Anil Sahith</span>&apos;s Portfolio
          </h1>
          <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg mb-6">Loading terminal environment...</p>
          <p className="text-gray-400 mb-6">The page will refresh automatically in a moment.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Refresh Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 p-4 perspective-1000">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Anil&apos;s Portfolio</span>
        </h1>

        <motion.p
          className="text-base md:text-lg text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Interact with the terminal below to explore my portfolio
        </motion.p>
      </motion.div>

      {/* Only render the terminal when we're on the client side */}
      {mounted && <Terminal />}

      <motion.div
        className="mt-6 text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>Type <span className="text-purple-400 font-mono">help</span> to see available commands</p>
        <p>Type <span className="text-purple-400 font-mono">portfolio</span> to skip to the main portfolio</p>
      </motion.div>
    </div>
  );
}
