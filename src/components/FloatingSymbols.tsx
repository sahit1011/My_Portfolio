'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Symbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  opacity: number;
  size: number;
}

const symbols = [
  'π', '∑', '∫', '√', 'α', 'β', 'γ', 'λ', 'μ', 'σ', '+', '-', '×', '÷', '=', '≠', '≤', '≥', '∞',
  'Δ', '∇', '∅', '∈', '∀', '∃', '∧', '∨', '¬', '⊕', '⊗', '0', '1', '<', '>', '{', '}', '[', ']',
  'x', 'y', 'z', 'a', 'b', 'c', 'θ', 'φ', 'ω', 'ε', 'δ', 'ρ', 'τ', 'η', 'ζ', 'χ', 'ψ', 'Ω'
];

const FloatingSymbols: React.FC = () => {
  const [symbolList, setSymbolList] = useState<Symbol[]>([]);

  useEffect(() => {
    // Initialize symbols falling from top
    const initialSymbols: Symbol[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * window.innerWidth,
      y: -Math.random() * 100, // Start above the screen
      speedX: 0, // No horizontal movement
      speedY: Math.random() * 2 + 0.5, // Falling speed between 0.5 and 2.5
      opacity: Math.random() * 0.5 + 0.2,
      size: Math.random() * 20 + 10
    }));
    setSymbolList(initialSymbols);

    // Animation loop
    const animate = () => {
      setSymbolList(prev =>
        prev.map(symbol => {
          const newY = symbol.y + symbol.speedY;

          // Reset to top when reaching bottom
          if (newY > window.innerHeight) {
            return {
              ...symbol,
              x: Math.random() * window.innerWidth,
              y: -Math.random() * 100,
              speedY: Math.random() * 2 + 0.5
            };
          }

          return { ...symbol, y: newY };
        })
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {symbolList.map(symbol => (
        <motion.div
          key={symbol.id}
          className="absolute text-white font-mono"
          style={{
            left: symbol.x,
            top: symbol.y,
            opacity: symbol.opacity,
            fontSize: `${symbol.size}px`,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            rotate: [0, 360]
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          {symbol.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingSymbols;