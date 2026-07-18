'use client';

/**
 * Neural field — the hero centerpiece.
 *
 * A full-frame web of drifting nodes that connect to their neighbours with
 * hairlines; signal pulses travel the links, and the cursor "excites" nearby
 * nodes (brighter links + gentle repulsion). Pure Canvas 2D — no WebGL — so it
 * renders reliably everywhere and stays cheap.
 *
 * Honors prefers-reduced-motion (draws one still frame, no loop). Decorative
 * only: content never depends on it.
 */

import { useEffect, useRef } from 'react';

const MINT = '127, 224, 194'; // rgb of the signal accent
const BRIGHT = '210, 255, 236'; // pulse / excited highlight

const LINK_DIST = 162; // px within which two nodes link
const CURSOR_DIST = 220; // px within which the cursor excites nodes
const MAX_PULSES = 7;
const PULSE_EVERY = 0.55; // seconds between pulse spawns

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Pulse {
  a: number; // node index
  b: number; // node index
  t: number; // 0..1 progress
  speed: number;
}

export default function NeuralField({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = 0;
    let pulseTimer = 0;

    // a comet that approaches the viewer (top-left → bottom-right, growing)
    let comet: { t: number; dur: number } | null = null;
    let cometTimer = 0;
    let nextComet = 2 + Math.random() * 1.5; // first one after 2–3.5s

    const pointer = { cx: -9999, cy: -9999, has: false };

    const seed = () => {
      const count = Math.min(120, Math.max(46, Math.round((w * h) / 13500)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.5 + 0.9,
      }));
      pulses = [];
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const spawnPulse = () => {
      if (pulses.length >= MAX_PULSES || nodes.length < 2) return;
      const a = (Math.random() * nodes.length) | 0;
      let best = -1;
      let bestD = LINK_DIST * LINK_DIST;
      for (let i = 0; i < nodes.length; i++) {
        if (i === a) continue;
        const dx = nodes[i].x - nodes[a].x;
        const dy = nodes[i].y - nodes[a].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) {
          bestD = d2;
          best = i;
        }
      }
      if (best >= 0) pulses.push({ a, b: best, t: 0, speed: 0.5 + Math.random() * 0.6 });
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const fade = 1 - Math.min(1, scrollRef.current) * 0.85; // dissolve as hero exits
      if (fade <= 0.02) return;

      // resolve pointer to canvas space (hero moves as the page scrolls)
      let px = -9999;
      let py = -9999;
      if (pointer.has) {
        const rect = canvas.getBoundingClientRect();
        px = pointer.cx - rect.left;
        py = pointer.cy - rect.top;
      }

      // advance nodes
      for (const n of nodes) {
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        // gentle cursor repulsion — "excite" the field
        if (pointer.has) {
          const dx = n.x - px;
          const dy = n.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < CURSOR_DIST * CURSOR_DIST && d2 > 1) {
            const d = Math.sqrt(d2);
            const force = (1 - d / CURSOR_DIST) * 0.6;
            n.x += (dx / d) * force;
            n.y += (dy / d) * force;
          }
        }
      }

      // links between neighbours
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * 0.28 * fade;
          ctx.strokeStyle = `rgba(${MINT}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // cursor → nearby nodes: brighter excitation links
      if (pointer.has) {
        for (const n of nodes) {
          const dx = n.x - px;
          const dy = n.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 > CURSOR_DIST * CURSOR_DIST) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / CURSOR_DIST) * 0.45 * fade;
          ctx.strokeStyle = `rgba(${BRIGHT}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${MINT}, ${0.72 * fade})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // signal pulses travelling along links
      pulseTimer += dt;
      if (pulseTimer > PULSE_EVERY) {
        pulseTimer = 0;
        spawnPulse();
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed * dt;
        if (p.t >= 1 || !nodes[p.a] || !nodes[p.b]) {
          pulses.splice(i, 1);
          continue;
        }
        const a = nodes[p.a];
        const b = nodes[p.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const glow = Math.sin(p.t * Math.PI); // fade in/out along the link
        ctx.fillStyle = `rgba(${BRIGHT}, ${0.9 * glow * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // comet approaching the viewer: top-left → bottom-right, growing as it nears.
      // Desktop only — skip entirely on narrow screens.
      cometTimer += dt;
      if (w < 1024) {
        comet = null;
      } else {
        if (!comet && cometTimer >= nextComet) {
          cometTimer = 0;
          nextComet = 4 + Math.random() * 2; // then every ~4–6s
          comet = { t: 0, dur: 4.6 }; // slower approach
        }
        if (comet) {
          comet.t += dt / comet.dur;
          if (comet.t >= 1) {
            comet = null;
          } else {
            const t = comet.t;
            const ease = Math.pow(t, 1.6); // accelerate + grow toward the viewer
            // path: off the top-left corner → off the bottom-right corner
            const x0 = -w * 0.08;
            const y0 = -h * 0.12;
            const cx = x0 + (w * 1.16) * ease;
            const cy = y0 + (h * 1.27) * ease;
            const scale = 0.12 + ease; // 0.12 → 1.12
            const coreR = 1.5 + scale * 6; // smaller, crisp
            const haloR = 4 + scale * 26;
            const tailLen = 50 + scale * 220;
            const opacity = Math.min(1, t * 4) * fade; // quick fade-in while far
            // straight-line travel direction (constant)
            const dlen = Math.hypot(w * 1.16, h * 1.27) || 1;
            const ux = (w * 1.16) / dlen;
            const uy = (h * 1.27) / dlen;
            const tx = cx - ux * tailLen;
            const ty = cy - uy * tailLen;
            const tail = ctx.createLinearGradient(tx, ty, cx, cy);
            tail.addColorStop(0, `rgba(${MINT}, 0)`);
            tail.addColorStop(1, `rgba(${MINT}, ${0.7 * opacity})`);
            ctx.strokeStyle = tail;
            ctx.lineWidth = 1 + scale * 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(cx, cy);
            ctx.stroke();
            // soft mint glow (tight, on-brand)
            const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
            halo.addColorStop(0, `rgba(${MINT}, ${0.5 * opacity})`);
            halo.addColorStop(1, `rgba(${MINT}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
            ctx.fill();
            // solid mint core with a hot center — crisp, not a fuzzy blob
            ctx.fillStyle = `rgba(150, 235, 205, ${opacity})`;
            ctx.beginPath();
            ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(240, 255, 250, ${opacity})`;
            ctx.beginPath();
            ctx.arc(cx, cy, coreR * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const loop = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.has = true;
    };
    const onPointerLeave = () => {
      pointer.has = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    if (reduced) {
      draw(0); // one still frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [scrollRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />;
}
