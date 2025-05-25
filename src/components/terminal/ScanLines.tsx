'use client';

import React from 'react';

interface ScanLinesProps {
  className?: string;
  opacity?: number;
}

const ScanLines: React.FC<ScanLinesProps> = ({ 
  className = '',
  opacity = 0.15
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        zIndex: 10,
      }}
    >
      {/* Scan lines overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(32, 32, 32, ${opacity}) 50%,
            transparent 100%
          )`,
          backgroundSize: '100% 4px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* CRT flicker effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'transparent',
          opacity: 0.03,
          animation: 'flicker 0.15s infinite',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Screen edge vignette */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.3)',
          mixBlendMode: 'multiply',
        }}
      />
      
      <style jsx>{`
        @keyframes flicker {
          0% { opacity: 0.01; }
          10% { opacity: 0.02; }
          20% { opacity: 0.03; }
          30% { opacity: 0.01; }
          40% { opacity: 0.02; }
          50% { opacity: 0.03; }
          60% { opacity: 0.02; }
          70% { opacity: 0.01; }
          80% { opacity: 0.03; }
          90% { opacity: 0.02; }
          100% { opacity: 0.01; }
        }
      `}</style>
    </div>
  );
};

export default ScanLines;
