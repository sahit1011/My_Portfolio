'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  underlineColor?: string;
  underlineHeight?: number;
  hoverEffect?: 'underline' | 'background' | 'glow' | 'scale';
  exact?: boolean;
}

const AnimatedNavLink: React.FC<AnimatedNavLinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = 'text-purple-600',
  underlineColor = '#9333ea',
  underlineHeight = 2,
  hoverEffect = 'underline',
  exact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  // Check if the link is active
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href) && href !== '/' ? true : pathname === href;

  // Base classes
  const baseClasses = `relative px-3 py-2 transition-all duration-200 ${className} ${isActive ? activeClassName : ''}`;

  // Hover effect variants
  const getHoverEffects = () => {
    switch (hoverEffect) {
      case 'background':
        return {
          initial: { backgroundColor: 'rgba(0, 0, 0, 0)' },
          hover: { backgroundColor: 'rgba(147, 51, 234, 0.1)' },
        };
      case 'glow':
        return {
          initial: { textShadow: '0 0 0px rgba(147, 51, 234, 0)' },
          hover: { textShadow: '0 0 8px rgba(147, 51, 234, 0.5)' },
        };
      case 'scale':
        return {
          initial: { scale: 1 },
          hover: { scale: 1.1 },
        };
      case 'underline':
      default:
        return {
          initial: {},
          hover: {},
        };
    }
  };

  const hoverEffects = getHoverEffects();

  return (
    <motion.div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={hoverEffects.initial}
      whileHover={hoverEffects.hover}
      transition={{
        duration: 0.15, // Faster animation
        type: 'spring',
        stiffness: 500,
        damping: 25
      }}
    >
      <Link href={href} className={baseClasses}>
        <motion.span
          initial={{ y: 0 }}
          whileHover={{ y: -1 }}
          transition={{
            duration: 0.15, // Faster animation
            type: 'spring',
            stiffness: 500,
            damping: 25
          }}
        >
          {children}
        </motion.span>

        {/* Animated underline */}
        {hoverEffect === 'underline' && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-purple-600"
            style={{ backgroundColor: underlineColor, height: `${underlineHeight}px` }}
            initial={{ width: isActive ? '100%' : '0%', left: '50%', right: '50%', opacity: isActive ? 1 : 0 }}
            animate={{
              width: isHovered || isActive ? '100%' : '0%',
              left: isHovered || isActive ? '0%' : '50%',
              right: isHovered || isActive ? '0%' : '50%',
              opacity: isHovered || isActive ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: [0.19, 1.0, 0.22, 1.0] }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default AnimatedNavLink;
