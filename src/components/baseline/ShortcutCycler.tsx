'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaApple, FaWindows, FaLinux } from 'react-icons/fa';

const KEYS = [
  { Icon: FaApple, combo: '⌘ K' },
  { Icon: FaWindows, combo: 'Ctrl K' },
  { Icon: FaLinux, combo: 'Ctrl K' },
];

/** Rotating shortcut hint — cycles Mac → Windows → Linux. */
export default function ShortcutCycler({ className = '' }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % KEYS.length), 2400);
    return () => clearInterval(t);
  }, []);

  const { Icon, combo } = KEYS[i];

  return (
    <span className={`relative inline-flex h-4 min-w-[3.25rem] items-center justify-start overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-1 font-mono text-[10px]"
        >
          <Icon size={9} className="opacity-70" />
          <kbd className="rounded border border-hair px-1 py-0.5 font-sans text-[10px] leading-none">{combo}</kbd>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
