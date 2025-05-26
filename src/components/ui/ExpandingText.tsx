'use client';

import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ExpandingTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  expandScale?: number;
  letterSpacing?: string;
  gradientColors?: string[];
  animateGradient?: boolean;
  textShadow?: boolean;
  glowIntensity?: number;
  staggerChildren?: boolean;
}

const ExpandingText: React.FC<ExpandingTextProps> = ({
  children,
  className = '',
  as = 'span',
  expandScale = 1.05,
  letterSpacing = '0.02em',
  gradientColors = ['#3b82f6', '#8b5cf6'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animateGradient = true,
  textShadow = true,
  glowIntensity = 0.3,
  staggerChildren = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Create gradient string from colors array
  const gradientString = `linear-gradient(90deg, ${gradientColors.join(', ')})`;
  const Component = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>;

  // For staggered text animation
  const isString = typeof children === 'string';
  const letters = isString ? children.toString().split('') : null;

  // Text shadow based on gradient colors
  const shadowColor = gradientColors[0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const textShadowValue = textShadow
    ? `0 0 ${glowIntensity * 15}px ${shadowColor}`
    : 'none';

  // If using staggered animation and the content is a simple string
  if (staggerChildren && letters) {
    return (
      <Component
        className={`expanding-text ${className}`}
        style={{ display: 'inline-block' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{
              display: 'inline-block',
              backgroundImage: gradientString,
              backgroundSize: '200% 100%',
              backgroundPosition: '0% 50%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent', // Start with transparent for gradient effect
              textShadow: 'none',
              opacity: 1,
            }}
            animate={isHovered ? {
              scale: expandScale,
              letterSpacing: letterSpacing,
            } : {
              scale: 1,
              letterSpacing: '0em',
            }}
            style={{
              // Ensure gradient properties are always applied
              backgroundImage: gradientString,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
              delay: index * 0.02,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </Component>
    );
  }

  // Standard animation for non-staggered text
  return (
    <Component
      className={`expanding-text ${className}`}
      whileHover={{
        scale: expandScale,
        letterSpacing: letterSpacing,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
      style={{
        display: 'inline-block',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="expanding-text-inner"
        initial={{
          backgroundImage: gradientString,
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 50%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'currentColor',
          textShadow: 'none',
        }}
        animate={isHovered ? {
          color: 'transparent',
        } : {
          color: 'currentColor',
        }}
        transition={{
          duration: 0.3, // Faster animation
          ease: [0.19, 1.0, 0.22, 1.0], // Ease out expo
        }}
      >
        {children}
      </motion.span>
    </Component>
  );
};

export default ExpandingText;
