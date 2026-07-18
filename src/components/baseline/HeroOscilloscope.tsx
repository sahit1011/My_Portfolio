'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './motion';

const SIGNAL = '127, 224, 194';

/**
 * "Oscilloscope" — a phosphor CRT scope. A Lissajous trace sweeps across a
 * faint graticule with a glowing decaying tail. The cursor bends the trace's
 * X/Y frequencies. Pauses off-screen / tab hidden; static frame for
 * reduced-motion users.
 */
export default function HeroOscilloscope() {
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

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // eased frequencies (cursor-driven)
    let fx = 3;
    let fy = 2;
    const TRAIL = 240;

    const graticule = (cx: number, cy: number, rx: number, ry: number) => {
      ctx.strokeStyle = 'rgba(127, 224, 194, 0.06)';
      ctx.lineWidth = 1;
      const step = Math.min(rx, ry) / 2.5;
      for (let gx = cx - rx; gx <= cx + rx + 0.1; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, cy - ry);
        ctx.lineTo(gx, cy + ry);
        ctx.stroke();
      }
      for (let gy = cy - ry; gy <= cy + ry + 0.1; gy += step) {
        ctx.beginPath();
        ctx.moveTo(cx - rx, gy);
        ctx.lineTo(cx + rx, gy);
        ctx.stroke();
      }
      // center cross
      ctx.strokeStyle = 'rgba(127, 224, 194, 0.12)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - ry);
      ctx.lineTo(cx, cy + ry);
      ctx.moveTo(cx - rx, cy);
      ctx.lineTo(cx + rx, cy);
      ctx.stroke();
    };

    const draw = (phase: number) => {
      ctx.clearRect(0, 0, w, h);
      if (w === 0 || h === 0) return;

      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.min(w, h) * 0.4;
      const ry = rx;

      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;
      const inside = mx >= 0 && mx <= w && my >= 0 && my <= h;
      const tfx = inside ? 2 + (mx / w) * 4 : 3;
      const tfy = inside ? 1 + (my / h) * 4 : 2;
      fx += (tfx - fx) * 0.04;
      fy += (tfy - fy) * 0.04;

      graticule(cx, cy, rx, ry);

      const delta = phase * 0.6;
      const pt = (u: number) => ({
        x: cx + rx * Math.sin(fx * u + delta),
        y: cy + ry * Math.sin(fy * u),
      });

      // glowing trail (head bright, tail faint)
      ctx.lineCap = 'round';
      ctx.shadowColor = `rgba(${SIGNAL}, 0.7)`;
      ctx.shadowBlur = 8;
      let prev = pt(phase);
      for (let i = 1; i <= TRAIL; i++) {
        const u = phase - (i / TRAIL) * Math.PI * 2;
        const p = pt(u);
        const k = 1 - i / TRAIL;
        ctx.strokeStyle = `rgba(${SIGNAL}, ${k * k * 0.9})`;
        ctx.lineWidth = 0.6 + k * 1.8;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        prev = p;
      }

      // bright head dot
      const head = pt(phase);
      ctx.fillStyle = `rgba(${SIGNAL}, 1)`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    if (reduced) {
      draw(0);
      const roStatic = new ResizeObserver(() => {
        resize();
        draw(0);
      });
      roStatic.observe(wrap);
      return () => {
        roStatic.disconnect();
        window.removeEventListener('pointermove', onMove);
      };
    }

    let phase = 0;
    let raf = 0;
    let running = false;
    const loop = () => {
      phase += 0.01;
      draw(phase);
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
      <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[110px]" />

      <canvas ref={canvasRef} className="relative h-full w-full" />

      {/* CRT scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.18) 3px)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1 top-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            signal
          </span>
        </div>
        <div className="absolute bottom-2 right-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          scope · x/y
        </div>
      </div>
    </motion.div>
  );
}
