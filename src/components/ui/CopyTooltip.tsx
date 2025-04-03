'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CopyTooltipProps {
  text: string;
  label: string;
  id: string; // Unique identifier for this tooltip
}

// Global state to track which tooltip is currently open
let activeTooltipId: string | null = null;

const CopyTooltip: React.FC<CopyTooltipProps> = ({ text, label, id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle tooltip visibility
  const toggleTooltip = () => {
    if (!isVisible) {
      // If opening this tooltip, close any other open tooltip
      activeTooltipId = id;
      setIsVisible(true);
    } else {
      // If closing this tooltip, clear the active tooltip ID
      activeTooltipId = null;
      setIsVisible(false);
    }
  };

  // Handle clicks outside the tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        activeTooltipId = null;
      }
    };

    // Close this tooltip if another one is opened
    const checkActiveTooltip = () => {
      if (isVisible && activeTooltipId !== id) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', checkActiveTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', checkActiveTooltip);
    };
  }, [isVisible, id]);

  return (
    <div className="relative">
      <div
        ref={iconRef}
        className="cursor-pointer"
        onClick={toggleTooltip}
      >
        {/* Children will be the icon */}
        {label}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 px-3 text-sm min-w-[200px]"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800"></div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-gray-100">{text}</span>
              <button
                onClick={handleCopy}
                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? (
                  <FaCheck className="text-green-500" size={14} />
                ) : (
                  <FaCopy className="text-gray-500 dark:text-gray-400" size={14} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CopyTooltip;
