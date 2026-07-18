'use client';

import { useEffect, useRef } from 'react';
import NeuralField from './NeuralField';

/**
 * Hosts the WebGL hero backdrop and feeds it a 0→1 scroll progress (how far the
 * hero has scrolled out) so the camera lifts and tilts as you scroll. The visual
 * is purely decorative — content never depends on it rendering.
 */
export default function HeroBackdrop() {
  const scrollRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const span = window.innerHeight * 0.9;
      scrollRef.current = Math.min(1, Math.max(0, -top / span));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <NeuralField scrollRef={scrollRef} />
    </div>
  );
}
