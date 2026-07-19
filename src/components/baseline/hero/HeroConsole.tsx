'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../motion';

interface Line {
  kind: 'cmd' | 'out';
  text: string;
  accent?: boolean;
}

/** The session transcript — real facts, terminal-flavoured. */
const SCRIPT: Line[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'anil · software engineer — AI/ML' },
  { kind: 'out', text: 'currently: voice-AI platform @ Arrowhead' },
  { kind: 'cmd', text: 'ls ~/ships --recent' },
  { kind: 'out', text: '▸ cryptai    multi-agent trading desk', accent: true },
  { kind: 'out', text: '▸ studyarc   AI study planner — NEET/JEE', accent: true },
  { kind: 'out', text: '▸ klaro      mini AI analyst for CSVs', accent: true },
  { kind: 'cmd', text: 'status' },
  { kind: 'out', text: '● open to work — bangalore / remote', accent: true },
];

const CMD_CHAR_MS = 42;
const OUT_LINE_MS = 160;
const BLOCK_PAUSE_MS = 420;

/**
 * Terminal console card for the hero's right column. Types a short, real
 * session (whoami → recent ships → status) once, then idles with a blinking
 * caret. Reduced-motion renders the full transcript instantly.
 */
export default function HeroConsole() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState<Line[]>(reduced ? SCRIPT : []);
  const [partial, setPartial] = useState('');
  const [finished, setFinished] = useState(!!reduced);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    let li = 0;
    let ci = 0;
    const tick = () => {
      if (li >= SCRIPT.length) {
        setFinished(true);
        return;
      }
      const line = SCRIPT[li];
      if (line.kind === 'cmd') {
        if (ci < line.text.length) {
          ci++;
          setPartial(line.text.slice(0, ci));
          timer.current = setTimeout(tick, CMD_CHAR_MS);
        } else {
          setDone((d) => [...d, line]);
          setPartial('');
          li++;
          ci = 0;
          timer.current = setTimeout(tick, OUT_LINE_MS);
        }
      } else {
        setDone((d) => [...d, line]);
        li++;
        const next = SCRIPT[li];
        timer.current = setTimeout(tick, next?.kind === 'cmd' ? BLOCK_PAUSE_MS : OUT_LINE_MS);
      }
    };
    timer.current = setTimeout(tick, 900);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
      className="w-full max-w-[29.5rem] overflow-hidden rounded-2xl border border-hair bg-surface/80 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-hair px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal/40" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          anil@portfolio · zsh
        </span>
      </div>

      {/* transcript */}
      <div className="min-h-[15.5rem] px-4 py-4 font-mono text-[12.5px] leading-[1.75]">
        {done.map((l, i) =>
          l.kind === 'cmd' ? (
            <p key={i} className="text-ink">
              <span className="text-signal">$ </span>
              {l.text}
            </p>
          ) : (
            <p key={i} className={l.accent ? 'text-signal/90' : 'text-muted'}>
              {l.text}
            </p>
          )
        )}
        <p className="text-ink">
          <span className="text-signal">$ </span>
          {partial}
          <span className={`ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[3px] bg-signal ${finished || partial ? 'animate-blink' : ''}`} />
        </p>
      </div>
    </motion.div>
  );
}
