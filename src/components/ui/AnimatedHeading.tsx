'use client';

import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  underline?: boolean;
  underlineColor?: string;
  underlineHeight?: number;
  underlineWidth?: number;
  gradientText?: boolean;
  gradientColors?: string[];
  staggerLetters?: boolean;
  textShadow?: boolean;
  shadowColor?: string;
  shadowIntensity?: number;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  children,
  className = '',
  as = 'h2',
  underline = true,
  underlineColor = '#3b82f6',
  underlineHeight = 3,
  underlineWidth = 100,
  gradientText = true,
  gradientColors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  staggerLetters = false,
  shadowColor = 'rgba(59, 130, 246, 0.5)',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Create gradient string from colors array
  const gradientString = `linear-gradient(90deg, ${gradientColors.join(', ')})`;

  // For staggered text animation
  const isString = typeof children === 'string';
  const letters = isString ? children.toString().split('') : null;

  // Determine the component to render
  const Component = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>;

  // If using staggered animation and the content is a simple string
  if (staggerLetters && letters && children) {
    // Split the text into words to apply different styles
    const text = children.toString();
    const words = text.split(' ');

    return (
      <Component
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative inline-flex">
          {words.map((word, wordIndex) => {
            // Only apply gradient to words after the first one
            const shouldApplyGradient = wordIndex > 0;

            return (
              <React.Fragment key={`word-${wordIndex}`}>
                {wordIndex > 0 && <span>&nbsp;</span>}
                <span
                  style={{
                    display: 'inline-block',
                    backgroundImage: shouldApplyGradient ? gradientString : 'none',
                    backgroundSize: '200% 100%',
                    backgroundPosition: isHovered ? '100% 50%' : '0% 50%',
                    WebkitBackgroundClip: shouldApplyGradient ? 'text' : 'border-box',
                    backgroundClip: shouldApplyGradient ? 'text' : 'border-box',
                    color: shouldApplyGradient ? 'transparent' : 'currentColor',
                    transition: 'background-position 0.3s ease-in-out',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    opacity: 1, // Ensure the text is always visible
                  }}
                >
                  {word.split('').map((letter, letterIndex) => {
                    // Calculate the overall index for animation delay
                    const index = letterIndex + (wordIndex * 10);

                    return (
                      <motion.span
                        key={`letter-${index}`}
                        initial={{
                          display: 'inline-block',
                          opacity: 1,
                        }}
                        animate={isHovered ? {
                          y: [0, -5, 0],
                          scale: 1.1,
                          fontWeight: 'bold',
                          opacity: 1,
                        } : {
                          y: 0,
                          scale: 1,
                          fontWeight: 'inherit',
                          opacity: 1,
                        }}
                        transition={{
                          y: {
                            duration: 0.2,
                            delay: index * 0.02,
                            ease: 'easeOut',
                          },
                          scale: {
                            duration: 0.2,
                            delay: index * 0.02,
                            ease: 'easeOut',
                          },
                        }}
                        style={{
                          // Don't override parent gradient styling
                          color: shouldApplyGradient ? 'transparent' : 'currentColor',
                          background: 'inherit',
                          backgroundClip: 'inherit',
                          WebkitBackgroundClip: 'inherit',
                        }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {underline && (
          <motion.div
            className="absolute left-0 bottom-0 bg-blue-500"
            style={{
              height: `${underlineHeight}px`,
              backgroundColor: underlineColor,
            }}
            initial={{ width: '0%' }}
            animate={{
              width: isHovered ? `${underlineWidth}%` : '0%',
              boxShadow: isHovered
                ? `0 0 10px ${shadowColor}`
                : 'none',
            }}
            transition={{
              duration: 0.2, // Faster animation
              ease: 'easeInOut',
            }}
          />
        )}
      </Component>
    );
  }

  // Standard animation for non-staggered text
  // Split the text into words to apply different styles
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  // If it's a simple string with multiple words
  if (words.length > 1 && typeof children === 'string') {
    return (
      <Component
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="inline-flex">
          {/* First word with normal styling */}
          <motion.span
            className="mr-2"
            initial={{ scale: 1 }}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {words[0]}
          </motion.span>

          {/* Second word with gradient */}
          <span
            style={{
              display: 'inline-block',
              backgroundImage: gradientString,
              backgroundSize: '200% 100%',
              backgroundPosition: isHovered ? '100% 50%' : '0% 50%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent', // Always show gradient for second word
              transition: 'background-position 0.3s ease-in-out',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              opacity: 1, // Ensure the text is always visible
            }}
          >
            {words.slice(1).join(' ').split('').map((letter, index) => (
              <motion.span
                key={`second-word-letter-${index}`}
                initial={{
                  display: 'inline-block',
                  opacity: 1,
                }}
                animate={isHovered ? {
                  y: [0, -5, 0],
                  scale: 1.05,
                  fontWeight: 'bold',
                  opacity: 1,
                } : {
                  y: 0,
                  scale: 1,
                  fontWeight: 'inherit',
                  opacity: 1,
                }}
                transition={{
                  y: {
                    duration: 0.2,
                    delay: index * 0.02,
                    ease: 'easeOut',
                  },
                  scale: {
                    duration: 0.2,
                    delay: index * 0.02,
                    ease: 'easeOut',
                  },
                }}
                style={{
                  // Don't override parent gradient styling
                  color: 'transparent',
                  background: 'inherit',
                  backgroundClip: 'inherit',
                  WebkitBackgroundClip: 'inherit',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </span>
      </Component>
    );
  }

  // Fallback for single words or non-string children
  return (
    <Component
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          display: 'inline-block',
          backgroundImage: gradientText ? gradientString : 'none',
          backgroundSize: '200% 100%',
          backgroundPosition: isHovered ? '100% 50%' : '0% 50%',
          WebkitBackgroundClip: gradientText ? 'text' : 'border-box',
          backgroundClip: gradientText ? 'text' : 'border-box',
          color: gradientText ? 'transparent' : 'currentColor',
          transition: 'background-position 0.3s ease-in-out',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          opacity: 1, // Ensure the text is always visible
        }}
      >
        {typeof children === 'string' ?
          children.split('').map((letter, index) => (
            <motion.span
              key={`letter-${index}`}
              initial={{
                display: 'inline-block',
                opacity: 1,
              }}
              animate={isHovered ? {
                y: [0, -5, 0],
                scale: 1.05,
                fontWeight: 'bold',
                opacity: 1,
              } : {
                y: 0,
                scale: 1,
                fontWeight: 'inherit',
                opacity: 1,
              }}
              transition={{
                y: {
                  duration: 0.2,
                  delay: index * 0.02,
                  ease: 'easeOut',
                },
                scale: {
                  duration: 0.2,
                  delay: index * 0.02,
                  ease: 'easeOut',
                },
              }}
              style={{
                // Don't override parent gradient styling
                color: gradientText ? 'transparent' : 'currentColor',
                background: 'inherit',
                backgroundClip: 'inherit',
                WebkitBackgroundClip: 'inherit',
              }}
            >
              {letter}
            </motion.span>
          ))
          : children
        }
      </span>

      {underline && (
        <motion.div
          className="absolute left-0 bottom-0 bg-blue-500"
          style={{
            height: `${underlineHeight}px`,
            backgroundColor: underlineColor,
          }}
          initial={{ width: '0%' }}
          animate={{
            width: isHovered ? `${underlineWidth}%` : '0%',
            boxShadow: isHovered
              ? `0 0 10px ${shadowColor}`
              : 'none',
          }}
          transition={{
            duration: 0.2, // Faster animation
            ease: 'easeInOut',
          }}
        />
      )}
    </Component>
  );
};

export default AnimatedHeading;
