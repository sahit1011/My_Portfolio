'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  // const pathname = usePathname(); // Pathname check removed for navbar integration

  // Logic to hide on specific pages can be handled by parent if needed, or removed if always visible in navbar
  // if (pathname === '/') {
  //   return null;
  // }

  return (
    <motion.button
      onClick={toggleTheme}
      // className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-800 shadow-md" // Fixed positioning removed
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150" // Basic styling for navbar
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="text-gray-700 dark:text-gray-300" size={20} />
      ) : (
        <FaSun className="text-yellow-500" size={20} />
      )}
    </motion.button>
  );
}
