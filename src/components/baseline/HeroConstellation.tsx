'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './motion';

// Phosphor accent (matches `signal` token) as raw RGB for canvas rgba().
const SIGNAL = '127, 224, 194';

type Node = { x: number; y: number; vx: number; vy: number; r: number; ph: number };

/**
 * "Constellation" — a flat field of slowly drifting nodes that link up when
 * they pass near each other, forming a shifting web. The cursor becomes an
 * extra node: nearby points connect to it and brighten, so the lattice reaches
 * toward the pointer. Pure 2D canvas, no deps. Pauses when off-screen / tab
 * hidden; degrades to one static frame for reduced-motion users.
 */
export default function HeroConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];

    const build = () => {
      const count = Math.max(18, Math.min(56, Math.round((w * h) / 13000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: 1 + Math.random() * 1.6,
          ph: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();

    // cursor tracked on window so the field reacts anywhere on the hero
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (w === 0 || h === 0) return;

      const t = performance.now();
      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;
      const inside = mx >= -80 && mx <= w + 80 && my >= -80 && my <= h + 80;

      const link = Math.max(110, Math.min(w, h) * 0.34);
      const link2 = link * link;
      const reach = link * 1.05;
      const reach2 = reach * reach;

      // drift + wrap
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
      }

      // node ↔ node links (closer = brighter)
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            ctx.strokeStyle = `rgba(${SIGNAL}, ${(1 - Math.sqrt(d2) / link) * 0.16})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes + cursor links (the field reaches toward the pointer)
      for (const n of nodes) {
        let r = n.r * (0.82 + 0.18 * Math.sin(t * 0.0016 + n.ph));
        let a = 0.34 + (n.r / 2.6) * 0.34;
        if (inside) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach2) {
            const k = 1 - Math.sqrt(d2) / reach;
            ctx.strokeStyle = `rgba(${SIGNAL}, ${k * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
            r += k * 1.8;
            a = Math.min(1, a + k * 0.5);
          }
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${SIGNAL}, ${a})`;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // reduced motion: one static frame, no loop
    if (reduced) {
      draw();
      const roStatic = new ResizeObserver(() => {
        resize();
        draw();
      });
      roStatic.observe(wrap);
      return () => {
        roStatic.disconnect();
        window.removeEventListener('pointermove', onMove);
      };
    }

    // animation loop, gated on visibility for perf
    let raf = 0;
    let running = false;
    const loop = () => {
      draw();
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
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );
    io.observe(wrap);

    const onVis = () => update();
    document.addEventListener('visibilitychange', onVis);

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.35 }}
      className="relative h-full w-full"
    >
      {/* phosphor glow behind the field */}
      <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[100px]" />

      <canvas ref={canvasRef} className="relative h-full w-full" />

      {/* instrument HUD labels */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1 top-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            network
          </span>
        </div>
        <div className="absolute bottom-2 right-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          nodes · live
        </div>
      </div>
    </motion.div>
  );
}
