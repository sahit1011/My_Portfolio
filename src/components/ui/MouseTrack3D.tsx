'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MouseTrack3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Controls the intensity of the effect (1-10)
  perspective?: number; // Controls the perspective value
  disabled?: boolean; // Allows disabling the effect
}

const MouseTrack3D: React.FC<MouseTrack3DProps> = ({
  children,
  className = '',
  intensity = 5,
  perspective = 1000,
  disabled = false,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const scaledIntensity = intensity * 0.2; // Scale down the intensity for more subtle effects

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate the center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate the mouse position relative to the center of the card
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation values based on mouse position
    // Divide by larger values for more subtle rotation
    const rotateYValue = (mouseX / (rect.width / 2)) * scaledIntensity;
    const rotateXValue = -(mouseY / (rect.height / 2)) * scaledIntensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    setRotateX(0);
    setRotateY(0);
  };

  // Reset on mobile devices
  useEffect(() => {
    const handleTouchStart = () => {
      setRotateX(0);
      setRotateY(0);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('touchstart', handleTouchStart);
      return () => {
        card.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`mouse-tracking-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

export default MouseTrack3D;
