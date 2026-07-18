'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const POP = { type: 'spring', stiffness: 260, damping: 20 } as const;

function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-md border border-hair bg-elevated px-4 py-3"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}

export default function ChatBio({ messages }: { messages: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  // Reveal messages one at a time, with a "typing" pause before each.
  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(messages.length);
      setTyping(false);
      return;
    }
    if (shown >= messages.length) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const delay = shown === 0 ? 650 : Math.min(1500, 450 + messages[shown].length * 11);
    const t = setTimeout(() => {
      setTyping(false);
      setShown((s) => s + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, shown, messages]);

  // keep scrolled to the latest bubble
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [shown, typing]);

  return (
    <div ref={ref} className="flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-hair bg-base sm:h-[30rem] lg:h-[28rem]">
      {/* header bar */}
      <div className="flex items-center gap-3 border-b border-hair bg-surface px-4 py-3.5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-signal/40">
          {/* WhatsApp default profile avatar (dark-mode palette) */}
          <svg viewBox="0 0 212 212" className="h-full w-full" role="img" aria-label="Profile avatar">
            <path
              fill="#6a7175"
              d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"
            />
            <g fill="#cfd4d9">
              <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.404-.182-.808-.361-1.214-.536a75.209 75.209 0 0 0-5.239-2.027 74.404 74.404 0 0 0-27.418-4.503c-9.55.246-18.62 2.376-26.767 6.033a75.593 75.593 0 0 0-1.19.549 74.803 74.803 0 0 0-6.191 3.213c-.66.394-1.315.8-1.965 1.217a73.02 73.02 0 0 0-6.328 4.601 71.85 71.85 0 0 0-5.847 5.446 70.204 70.204 0 0 0-3.21 3.558 67.612 67.612 0 0 0-2.626 3.326 63.79 63.79 0 0 0-2.072 2.966 105.03 105.03 0 0 0-.617.913C63.626 187.15 84.108 194 106 194c21.891 0 42.373-6.85 59.096-18.443a105.03 105.03 0 0 0-.617-.913l9.082-3.029z" />
              <path d="M106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.32 36.32 0 0 0 2.422-4.75 37.077 37.077 0 0 0 1.716-5.087c.4-1.62.7-3.28.895-4.973a38.35 38.35 0 0 0 .25-3.79c.001-.24.008-.48.008-.72s-.007-.48-.008-.72a38.14 38.14 0 0 0-.25-3.788 37.7 37.7 0 0 0-.895-4.973 37.077 37.077 0 0 0-1.716-5.087 36.583 36.583 0 0 0-2.422-4.75 35.923 35.923 0 0 0-9.49-10.48 36.307 36.307 0 0 0-6.149-3.671 37.124 37.124 0 0 0-5.12-1.958 38.272 38.272 0 0 0-3.624-.896 39.16 39.16 0 0 0-7.68-.737c-2.645 0-5.212.253-7.68.737a38.272 38.272 0 0 0-3.624.896 37.124 37.124 0 0 0-5.12 1.958 36.307 36.307 0 0 0-6.15 3.67 35.923 35.923 0 0 0-9.489 10.48 36.583 36.583 0 0 0-2.422 4.75 37.077 37.077 0 0 0-1.716 5.087c-.4 1.62-.7 3.28-.895 4.973a38.14 38.14 0 0 0-.25 3.788c-.001.24-.008.48-.008.72s.007.48.008.72c.046 1.274.132 2.54.25 3.79.194 1.693.495 3.353.895 4.973a37.077 37.077 0 0 0 1.716 5.087 36.32 36.32 0 0 0 2.422 4.75 35.923 35.923 0 0 0 9.49 10.48 36.307 36.307 0 0 0 6.149 3.671 37.124 37.124 0 0 0 5.12 1.958c1.185.352 2.394.65 3.624.896 2.468.484 5.035.737 7.68.737z" />
            </g>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            Anil Sahith
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          </p>
          <p className="font-mono text-[11px] text-faint">
            {typing ? 'typing…' : 'online · usually replies fast'}
          </p>
        </div>
        <span className="ml-auto font-mono text-[11px] text-faint">~/about</span>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-5">
        {messages.slice(0, shown).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={POP}
            className="w-fit max-w-[90%] rounded-2xl rounded-tl-md border border-hair bg-elevated px-4 py-2.5 text-[15px] leading-relaxed text-ink/90"
          >
            {m}
          </motion.div>
        ))}
        <AnimatePresence>{typing && <TypingDots key="typing" />}</AnimatePresence>
      </div>

      {/* input bar */}
      <div className="border-t border-hair bg-surface p-3">
        <Link
          href="#contact"
          className="group flex items-center gap-2 rounded-full border border-hair bg-elevated px-4 py-2.5 transition-colors hover:border-signal/50"
        >
          <span className="flex-1 font-mono text-sm text-faint transition-colors group-hover:text-muted">
            Say hi…
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-signal text-base transition-transform group-hover:translate-x-0.5">
            <FaArrowRight size={11} />
          </span>
        </Link>
      </div>
    </div>
  );
}
