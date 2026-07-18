'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './motion';

const SIGNAL = '127, 224, 194';
const R = 34;
const C = 2 * Math.PI * R;

/**
 * "Telemetry" — a live instrument panel: a radial gauge, a scrolling sparkline,
 * and ticking metric readouts driven by a smooth random walk. Values update via
 * refs (no React re-render). Pauses off-screen / tab hidden; static for
 * reduced-motion users.
 */
export default function HeroTelemetry() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<SVGCircleElement>(null);
  const gaugeNumRef = useRef<HTMLSpanElement>(null);
  const sparkRef = useRef<HTMLCanvasElement>(null);
  const latRef = useRef<HTMLSpanElement>(null);
  const rpsRef = useRef<HTMLSpanElement>(null);
  const gpuRef = useRef<HTMLSpanElement>(null);
  const latBar = useRef<HTMLDivElement>(null);
  const rpsBar = useRef<HTMLDivElement>(null);
  const gpuBar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const spark = sparkRef.current;
    if (!spark) return;
    const ctx = spark.getContext('2d');
    if (!ctx) return;

    // metric: { cur, target, min, max }
    const m = {
      load: { cur: 64, target: 64, min: 48, max: 86 },
      lat: { cur: 13, target: 13, min: 8, max: 28 },
      rps: { cur: 4.2, target: 4.2, min: 2.4, max: 6.8 },
      gpu: { cur: 58, target: 58, min: 35, max: 92 },
    };
    type Key = keyof typeof m;
    const keys: Key[] = ['load', 'lat', 'rps', 'gpu'];
    const history: number[] = new Array(56).fill(13);

    let sw = 0;
    let sh = 0;
    const sizeSpark = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sw = spark.clientWidth;
      sh = spark.clientHeight;
      spark.width = Math.max(1, Math.floor(sw * dpr));
      spark.height = Math.max(1, Math.floor(sh * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeSpark();

    const drawSpark = () => {
      if (sw === 0 || sh === 0) return;
      ctx.clearRect(0, 0, sw, sh);
      const lo = m.lat.min - 2;
      const hi = m.lat.max + 2;
      const n = history.length;
      const px = (i: number) => (i / (n - 1)) * sw;
      const py = (v: number) => sh - ((v - lo) / (hi - lo)) * sh;
      // area
      ctx.beginPath();
      ctx.moveTo(0, sh);
      for (let i = 0; i < n; i++) ctx.lineTo(px(i), py(history[i]));
      ctx.lineTo(sw, sh);
      ctx.closePath();
      ctx.fillStyle = `rgba(${SIGNAL}, 0.08)`;
      ctx.fill();
      // line
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = px(i);
        const y = py(history[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${SIGNAL}, 0.8)`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };

    const apply = () => {
      // gauge
      if (gaugeRef.current)
        gaugeRef.current.style.strokeDashoffset = `${C * (1 - m.load.cur / 100)}`;
      if (gaugeNumRef.current)
        gaugeNumRef.current.textContent = `${Math.round(m.load.cur)}`;
      // readouts
      if (latRef.current) latRef.current.textContent = `${m.lat.cur.toFixed(1)}ms`;
      if (rpsRef.current) rpsRef.current.textContent = `${m.rps.cur.toFixed(1)}k/s`;
      if (gpuRef.current) gpuRef.current.textContent = `${Math.round(m.gpu.cur)}%`;
      const pct = (x: Key) => `${((m[x].cur - m[x].min) / (m[x].max - m[x].min)) * 100}%`;
      if (latBar.current) latBar.current.style.width = pct('lat');
      if (rpsBar.current) rpsBar.current.style.width = pct('rps');
      if (gpuBar.current) gpuBar.current.style.width = pct('gpu');
      drawSpark();
    };

    if (reduced) {
      apply();
      const roStatic = new ResizeObserver(() => {
        sizeSpark();
        apply();
      });
      roStatic.observe(spark);
      return () => roStatic.disconnect();
    }

    let frame = 0;
    let raf = 0;
    let running = false;
    const loop = () => {
      frame++;
      if (frame % 40 === 0) {
        for (const k of keys) {
          const x = m[k];
          x.target = x.min + Math.random() * (x.max - x.min);
        }
      }
      for (const k of keys) {
        const x = m[k];
        x.cur += (x.target - x.cur) * 0.06;
      }
      if (frame % 4 === 0) {
        history.push(m.lat.cur);
        history.shift();
      }
      apply();
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
    if (wrapRef.current) io.observe(wrapRef.current);
    const onVis = () => update();
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => sizeSpark());
    ro.observe(spark);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  const Row = ({
    label,
    valueRef,
    barRef,
  }: {
    label: string;
    valueRef: React.RefObject<HTMLSpanElement | null>;
    barRef: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-faint">{label}</span>
        <span ref={valueRef} className="tabular-nums text-ink">
          —
        </span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-elevated">
        <div ref={barRef} className="h-full rounded-full bg-signal/70" style={{ width: '40%' }} />
      </div>
    </div>
  );

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
      className="relative flex h-full w-full items-center justify-center"
    >
      <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[100px]" />

      <div className="relative w-full max-w-[20rem] rounded-2xl border border-hair bg-surface/70 p-5 font-mono backdrop-blur">
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-faint">telemetry</span>
          <span className="flex items-center gap-1.5 text-[10px] text-signal">
            <span className="h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
            live
          </span>
        </div>

        {/* gauge + sparkline */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative h-[88px] w-[88px] shrink-0">
            <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
              <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
              <circle
                ref={gaugeRef}
                cx="44"
                cy="44"
                r={R}
                fill="none"
                stroke={`rgb(${SIGNAL})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span ref={gaugeNumRef} className="text-xl font-semibold tabular-nums text-ink">
                —
              </span>
              <span className="text-[9px] uppercase tracking-wider text-faint">load</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] text-faint">
              <span>latency</span>
              <span>56s</span>
            </div>
            <canvas ref={sparkRef} className="h-[52px] w-full" />
          </div>
        </div>

        {/* readouts */}
        <div className="space-y-2.5">
          <Row label="latency" valueRef={latRef} barRef={latBar} />
          <Row label="throughput" valueRef={rpsRef} barRef={rpsBar} />
          <Row label="gpu" valueRef={gpuRef} barRef={gpuBar} />
        </div>
      </div>
    </motion.div>
  );
}
