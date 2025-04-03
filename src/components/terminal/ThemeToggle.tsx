'use client';

import React from 'react';
import { FaWindows, FaLinux, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';

type OSTheme = 'windows' | 'linux' | 'mac';

interface ThemeToggleProps {
  currentTheme: OSTheme;
  onThemeChange: (theme: OSTheme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex justify-center space-x-4 mb-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onThemeChange('windows')}
        className={`p-2.5 rounded-lg transition-colors shadow-md ${
          currentTheme === 'windows'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-gray-200'
        }`}
        aria-label="Windows Terminal Theme"
        title="Windows Terminal Theme"
      >
        <FaWindows size={20} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onThemeChange('linux')}
        className={`p-2.5 rounded-lg transition-colors shadow-md ${
          currentTheme === 'linux'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-gray-200'
        }`}
        aria-label="Linux Terminal Theme"
        title="Linux Terminal Theme"
      >
        <FaLinux size={20} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onThemeChange('mac')}
        className={`p-2.5 rounded-lg transition-colors shadow-md ${
          currentTheme === 'mac'
            ? 'bg-gray-500 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-gray-200'
        }`}
        aria-label="macOS Terminal Theme"
        title="macOS Terminal Theme"
      >
        <FaApple size={20} />
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
