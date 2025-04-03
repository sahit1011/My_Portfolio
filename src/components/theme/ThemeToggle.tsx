'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Only show theme toggle on portfolio pages, not on the terminal page (home)
  if (pathname === '/') {
    return null;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-800 shadow-md"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="text-blue-700" size={20} />
      ) : (
        <FaSun className="text-yellow-400" size={20} />
      )}
    </motion.button>
  );
}
