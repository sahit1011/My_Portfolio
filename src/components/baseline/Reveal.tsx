'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { reveal, revealLeft, revealRight, revealStagger, viewportOnce } from './motion';

type RevealDirection = 'up' | 'left' | 'right';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger direct children that are also <Reveal.Item> / motion items. */
  stagger?: boolean;
  /** Entrance direction — vary it so sections don't all fade up identically. */
  variant?: RevealDirection;
  as?: 'div' | 'section' | 'ul' | 'li' | 'article';
  id?: string;
}

const BY_DIRECTION = { up: reveal, left: revealLeft, right: revealRight };

/**
 * Scroll-reveal wrapper. Sections & cards only (never words/paragraphs).
 * Transform + opacity exclusively. Honors reduced-motion via MotionConfig.
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  variant = 'up',
  as = 'div',
  id,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      id={id}
      className={className}
      variants={stagger ? revealStagger : BY_DIRECTION[variant]}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={reveal}>
      {children}
    </MotionTag>
  );
}
