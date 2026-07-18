'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './motion';

// luminance ramp, dark → bright
const CHARS = '.,-~:;=!*#$@';

/**
 * "ASCII donut" — the classic rotating torus (donut.c) rendered as glowing
 * phosphor characters into a <pre>. Text content is swapped each frame via ref
 * (no React re-render). Pauses off-screen / tab hidden; static frame for
 * reduced-motion users.
 */
export default function HeroAsciiDonut() {
  const preRef = useRef<HTMLPreElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const pre = preRef.current;
    const wrap = wrapRef.current;
    if (!pre || !wrap) return;

    const COLS = 46;
    const ROWS = 26;
    const R1 = 1;
    const R2 = 2;
    const K2 = 6;
    const K1 = COLS * 0.4;

    const fit = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      // monospace glyphs are ~0.6em wide at line-height 1
      const fs = Math.max(5, Math.min(w / (COLS * 0.6), h / ROWS));
      pre.style.fontSize = `${fs}px`;
    };
    fit();

    const render = (A: number, B: number) => {
      const out: string[] = new Array(COLS * ROWS).fill(' ');
      const zbuf: number[] = new Array(COLS * ROWS).fill(0);
      const cosA = Math.cos(A);
      const sinA = Math.sin(A);
      const cosB = Math.cos(B);
      const sinB = Math.sin(B);

      for (let theta = 0; theta < 6.283; theta += 0.1) {
        const ct = Math.cos(theta);
        const st = Math.sin(theta);
        const circleX = R2 + R1 * ct;
        const circleY = R1 * st;
        for (let phi = 0; phi < 6.283; phi += 0.03) {
          const cp = Math.cos(phi);
          const sp = Math.sin(phi);
          const x = circleX * (cosB * cp + sinA * sinB * sp) - circleY * cosA * sinB;
          const y = circleX * (sinB * cp - sinA * cosB * sp) + circleY * cosA * cosB;
          const z = K2 + cosA * circleX * sp + circleY * sinA;
          const ooz = 1 / z;
          const xp = Math.round(COLS / 2 + K1 * ooz * x);
          const yp = Math.round(ROWS / 2 - K1 * 0.5 * ooz * y);
          if (xp < 0 || xp >= COLS || yp < 0 || yp >= ROWS) continue;
          const L =
            cp * ct * sinB -
            cosA * ct * sp -
            sinA * st +
            cosB * (cosA * st - ct * sinA * sp);
          if (L > 0) {
            const idx = xp + COLS * yp;
            if (ooz > zbuf[idx]) {
              zbuf[idx] = ooz;
              const ci = Math.min(CHARS.length - 1, Math.floor(L * 8));
              out[idx] = CHARS[ci];
            }
          }
        }
      }

      let s = '';
      for (let r = 0; r < ROWS; r++) {
        s += out.slice(r * COLS, r * COLS + COLS).join('') + '\n';
      }
      pre.textContent = s;
    };

    if (reduced) {
      render(0.7, 1.2);
      const roStatic = new ResizeObserver(() => {
        fit();
        render(0.7, 1.2);
      });
      roStatic.observe(wrap);
      return () => roStatic.disconnect();
    }

    let A = 0;
    let B = 0;
    let raf = 0;
    let running = false;
    const loop = () => {
      A += 0.045;
      B += 0.025;
      render(A, B);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let visible = false;
    const update = () => {
      if (visible && !document.hidden) start();
      else stop();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );
    io.observe(wrap);
    const onVis = () => update();
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => fit());
    ro.observe(wrap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.35 }}
      className="relative flex h-full w-full items-center justify-center"
    >
      <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[100px]" />

      <pre
        ref={preRef}
        className="relative m-0 select-none font-mono leading-none text-signal"
        style={{ textShadow: '0 0 7px rgba(127,224,194,0.45)' }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1 top-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            render
          </span>
        </div>
        <div className="absolute bottom-2 right-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          torus · ascii
        </div>
      </div>
    </motion.div>
  );
}
