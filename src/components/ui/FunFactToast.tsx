'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegLightbulb, FaTimes } from 'react-icons/fa';
import { useFunFact } from '@/context/FunFactContext';

const FunFactToast: React.FC = () => {
  const { currentFact, showFact, dismissFact, disableAllFacts } = useFunFact();

  if (!currentFact) return null;

  return (
    <AnimatePresence>
      {showFact && (
        // Outer: positioning only (bottom-right on mobile, center-right on desktop).
        // Animates opacity only, so the responsive CSS transform (md:-translate-y-1/2) isn't clobbered.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-[60] w-[min(92vw,360px)] md:bottom-auto md:top-20"
          role="alert"
          aria-live="polite"
        >
          {/* Inner: slide-in + panel */}
          <motion.div
            initial={{ x: 32 }}
            animate={{ x: 0 }}
            exit={{ x: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="overflow-hidden rounded-xl border border-hair bg-surface/95 shadow-2xl backdrop-blur-md"
          >
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="stamp inline-flex items-center gap-2 text-signal">
                <FaRegLightbulb size={12} /> did_you_know
              </span>
              <button
                type="button"
                onClick={dismissFact}
                aria-label="Dismiss"
                className="rounded p-1 text-muted transition-colors hover:text-ink"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-ink/90">{currentFact.text}</p>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={dismissFact}
                className="font-mono text-xs text-muted transition-colors hover:text-signal"
              >
                dismiss
              </button>
              <button
                type="button"
                onClick={disableAllFacts}
                className="font-mono text-xs text-faint transition-colors hover:text-warn"
              >
                don&apos;t show again
              </button>
            </div>
          </div>

          {/* auto-dismiss progress bar */}
          <motion.div
            key={currentFact.id ?? currentFact.text}
            className="h-px origin-left bg-signal/60"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 20, ease: 'linear' }}
          />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FunFactToast;
