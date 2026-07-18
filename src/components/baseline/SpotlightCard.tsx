'use client';

import { motion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';
import { reveal } from './motion';

/**
 * Card with a cursor-following radial glow and optional 3D pointer-tilt.
 * All updates go through CSS custom props directly (no React state / re-render).
 *
 * The reveal (y/opacity) lives on the outer <article> — framer owns its
 * transform. The tilt (rotateX/rotateY) lives on a separate inner element so
 * the two never fight over the transform property. Reduced-motion flattens the
 * tilt via CSS.
 */
export default function SpotlightCard({
  children,
  className = '',
  tilt = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (tilt) {
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${(0.5 - py) * 5}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * 7}deg`);
    }
  };

  const onLeave = (e: MouseEvent<HTMLElement>) => {
    if (!tilt) return;
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <motion.article
      variants={reveal}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden ${tilt ? 'tilt-card' : ''} ${className}`}
    >
      <span className="spotlight-glow" aria-hidden />
      <div className={`relative z-[1] flex h-full flex-col ${tilt ? 'tilt-inner' : ''}`}>
        {children}
      </div>
    </motion.article>
  );
}
