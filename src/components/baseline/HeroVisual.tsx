'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './motion';

// Phosphor accent (matches `signal` token) as raw RGB for canvas rgba().
const SIGNAL = '127, 224, 194';

type P = { sx: number; sy: number; depth: number };

/**
 * "Latent space" — an interactive point-cloud orb rendered on a 2D canvas
 * (no 3D deps). Nodes sit on a Fibonacci sphere, wired to their nearest
 * neighbours into a slowly auto-rotating wireframe. The cursor tilts the orb
 * (parallax) and nearby nodes brighten + reach toward the pointer, so it reads
 * as a living neural lattice. Pauses when off-screen / tab hidden; degrades to
 * a single static frame for reduced-motion users.
 */
export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── build point cloud (Fibonacci sphere) ──────────────────────────
    const N = 130;
    const pts: { x: number; y: number; z: number; ph: number }[] = [];
    const golden = Math.PI * (1 + Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - ((i + 0.5) / N) * 2; // -1 .. 1
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, ph: i * 0.9 });
    }

    // ── precompute edges: K nearest neighbours in 3D (stable mesh) ─────
    const K = 3;
    const seen = new Set<string>();
    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const near: { j: number; d: number }[] = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dz = pts[i].z - pts[j].z;
        near.push({ j, d: dx * dx + dy * dy + dz * dz });
      }
      near.sort((a, b) => a.d - b.d);
      for (let k = 0; k < K; k++) {
        const j = near[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      }
    }

    // ── sizing (DPR-aware) ────────────────────────────────────────────
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── cursor (tracked on window so the orb reacts anywhere on hero) ──
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // rotation state + eased cursor tilt
    let rotY = 0.3;
    const baseRX = -0.18;
    let curRX = baseRX;
    let curRY = 0;
    const projected: P[] = new Array(N);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (w === 0 || h === 0) return;

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.4;
      const fov = 3.2;

      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;
      const inside = mx >= -60 && mx <= w + 60 && my >= -60 && my <= h + 60;

      // ease the cursor-driven tilt
      const targetRX = inside ? baseRX + (my / h - 0.5) * 0.6 : baseRX;
      const targetRY = inside ? (mx / w - 0.5) * 0.7 : 0;
      curRX += (targetRX - curRX) * 0.06;
      curRY += (targetRY - curRY) * 0.06;

      const ry = rotY + curRY;
      const rx = curRX;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const t = performance.now() * 0.001;

      // project all points (rotate Y then X, perspective divide)
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const scale = fov / (fov - z2);
        projected[i] = {
          sx: cx + x1 * radius * scale,
          sy: cy + y2 * radius * scale,
          depth: (z2 + 1) / 2, // 0 (back) .. 1 (front)
        };
      }

      // wireframe edges (behind nodes), brighter toward the front
      ctx.lineWidth = 1;
      for (let e = 0; e < edges.length; e++) {
        const a = projected[edges[e][0]];
        const b = projected[edges[e][1]];
        const dep = (a.depth + b.depth) / 2;
        ctx.strokeStyle = `rgba(${SIGNAL}, ${0.04 + dep * 0.16})`;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // nodes — depth gives size/opacity, gentle pulse, cursor proximity glow
      for (let i = 0; i < N; i++) {
        const pr = projected[i];
        const pulse = 0.75 + 0.25 * Math.sin(t * 1.6 + pts[i].ph);
        let r = (0.6 + pr.depth * 1.9) * pulse;
        let a = 0.22 + pr.depth * 0.6;
        if (inside) {
          const dx = pr.sx - mx;
          const dy = pr.sy - my;
          const dd = Math.sqrt(dx * dx + dy * dy);
          if (dd < 130) {
            const boost = 1 - dd / 130;
            r += boost * 2.4;
            a = Math.min(1, a + boost * 0.55);
          }
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${SIGNAL}, ${a})`;
        ctx.arc(pr.sx, pr.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // interactive links — the lattice reaches toward the cursor
      if (inside) {
        for (let i = 0; i < N; i++) {
          const pr = projected[i];
          if (pr.depth < 0.4) continue;
          const dx = pr.sx - mx;
          const dy = pr.sy - my;
          const dd = Math.sqrt(dx * dx + dy * dy);
          if (dd < 120) {
            ctx.strokeStyle = `rgba(${SIGNAL}, ${(1 - dd / 120) * 0.45 * pr.depth})`;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(pr.sx, pr.sy);
            ctx.stroke();
          }
        }
      }
    };

    // ── reduced motion: one static frame, no loop ─────────────────────
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

    // ── animation loop, gated on visibility for perf ──────────────────
    let raf = 0;
    let running = false;
    const loop = () => {
      rotY += 0.0016;
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
      {/* phosphor glow behind the orb */}
      <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[100px]" />

      <canvas ref={canvasRef} className="relative h-full w-full" />

      {/* instrument HUD labels */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1 top-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            latent&nbsp;space
          </span>
        </div>
        <div className="absolute bottom-2 right-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          n=130 · live
        </div>
      </div>
    </motion.div>
  );
}
