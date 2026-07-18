import type Lenis from 'lenis';

/**
 * Shared handle to the single Lenis instance created in SmoothScroll, so
 * overlays (command palette, terminal, modals) can pause inertial scrolling
 * while they're open — Lenis drives scroll via JS and ignores `overflow:hidden`,
 * so a plain body-scroll-lock isn't enough on its own.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const stopLenis = () => instance?.stop();
export const startLenis = () => instance?.start();
