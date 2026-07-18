'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
  external?: boolean;
  type?: 'button' | 'submit';
}

const VARIANTS: Record<string, string> = {
  solid:
    'bg-signal text-base hover:bg-signal-light shadow-[0_0_0_0_rgba(127,224,194,0)] hover:shadow-[0_0_28px_-6px_rgba(127,224,194,0.55)]',
  outline:
    'border border-hair text-ink hover:border-signal/50 hover:text-signal',
  ghost: 'text-muted hover:text-signal',
};

/**
 * Subtle magnetic pull toward the cursor (well-damped). Reduced-motion users
 * get no pull — MotionConfig neutralizes the spring. Press = scale(0.97).
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  external = false,
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * 0.35);
    y.set(my * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-mono text-sm font-medium transition-colors duration-200';
  const cls = `${base} ${VARIANTS[variant]} ${className}`;

  // mailto:/tel: open in-place (no blank tab); http(s) open in a new tab; else internal Link.
  const isProtocol = !!href && /^(mailto:|tel:)/.test(href);
  const isHttp = !!href && /^https?:/.test(href);

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex"
    >
      {href ? (
        isProtocol ? (
          <a href={href} className={cls}>
            {children}
          </a>
        ) : external || isHttp ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {children}
          </a>
        ) : (
          <Link href={href} className={cls}>
            {children}
          </Link>
        )
      ) : (
        <button type={type} onClick={onClick} className={cls}>
          {children}
        </button>
      )}
    </motion.div>
  );

  return inner;
}
