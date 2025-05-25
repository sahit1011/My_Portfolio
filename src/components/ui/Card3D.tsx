'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  trackMouse?: boolean;
  mouseIntensity?: number;
  gradientShadow?: boolean;
  glowOnHover?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  hoverScale = 1.02,
  gradientShadow = true,
  glowOnHover = true,
}) => {
  // Base classes for the card
  const baseClasses = `card-3d rounded-lg overflow-hidden ${
    gradientShadow ? 'gradient-shadow' : ''
  } ${glowOnHover ? 'glow-on-hover' : ''} ${className}`;

  // Simplified version - no mouse tracking, just simple scale effect
  return (
    <div className="perspective-container">
      <motion.div
        className={baseClasses}
        whileHover={{
          scale: hoverScale,
          translateY: -5
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 15,
          mass: 0.8
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Card3D;
