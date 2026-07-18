'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/** Counts up from 0 to `to` when scrolled into view. Respects reduced-motion. */
export default function CountUp({
  to,
  suffix = '',
  className = '',
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
