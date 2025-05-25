'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkillTag3DProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  icon?: React.ReactNode;
}

const SkillTag3D: React.FC<SkillTag3DProps> = ({
  children,
  className = '',
  featured = false,
  icon,
}) => {
  return (
    <motion.span
      className={`
        skill-tag-3d inline-flex items-center px-3 py-1 rounded-full text-sm relative
        ${featured
          ? 'bg-blue-500/20 dark:bg-blue-500/40 text-blue-800 dark:text-blue-100'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}
        ${className}
      `}
      whileHover={{
        y: -3,
        scale: 1.1,
        boxShadow: '0 0 15px rgba(103, 232, 249, 0.5)',
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 17,
      }}
    >
      {icon && (
        <span className="mr-1.5">{icon}</span>
      )}
      {children}

      {/* Glow effect overlay */}
      <motion.span
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.3 }}
        style={{ mixBlendMode: 'overlay' }}
      />
    </motion.span>
  );
};

export default SkillTag3D;
