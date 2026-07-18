'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis } from './lenisInstance';

/**
 * Site-wide inertial smooth scrolling. This is the single biggest "expensive"
 * cue on a portfolio — it makes every section transition feel deliberate.
 *
 * Uses real window scroll (not transform), so native scroll listeners
 * (the hero particle field) and IntersectionObserver reveals keep working.
 * Fully disabled under prefers-reduced-motion — the browser's native scroll
 * takes over, no inertia.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Touch devices keep native momentum scrolling; smoothing wheel only.
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // In-page anchor links (#work, #contact) should glide, not jump.
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchorClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
