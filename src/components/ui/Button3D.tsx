'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Button3DProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button3D: React.FC<Button3DProps> = ({
  children,
  className = '',
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  // Base classes for all button variants
  const baseClasses = `
    button-3d
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700',
    accent: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/30',
  };

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  // Content with icon
  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  // Animation variants
  const buttonVariants = {
    initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    hover: { 
      y: -2, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
    },
    tap: { 
      y: 1, 
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)' 
    },
  };

  // If href is provided, render as Link
  if (href) {
    return (
      <motion.div
        initial="initial"
        whileHover={disabled ? {} : "hover"}
        whileTap={disabled ? {} : "tap"}
        variants={buttonVariants}
      >
        <Link href={href} className={buttonClasses} onClick={disabled ? (e) => e.preventDefault() : undefined}>
          {content}
        </Link>
      </motion.div>
    );
  }

  // Otherwise render as button
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      initial="initial"
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "tap"}
      variants={buttonVariants}
    >
      {content}
    </motion.button>
  );
};

export default Button3D;
