'use client';

import { motion } from 'framer-motion';
import { reveal, revealHeading, revealRule, revealStagger, viewportOnce } from '../motion';

/**
 * Section heading. No numbered markers — an accent hairline draws in, the mono
 * label fades, then the title settles. Consistent brand voice, not AI scaffolding.
 */
export default function SectionHeader({
  stamp,
  title,
  intro,
}: {
  stamp: string;
  title: string;
  intro?: string;
}) {
  return (
    <motion.header
      className="mb-12 max-w-3xl"
      variants={revealStagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <div className="mb-5 flex items-center gap-3">
        <motion.span variants={revealRule} className="h-px w-10 origin-left bg-signal/60" aria-hidden />
        <motion.span variants={reveal} className="stamp text-signal">
          {stamp}
        </motion.span>
      </div>
      <motion.h2 variants={revealHeading} className="text-h2 font-semibold tracking-tight text-ink">
        {title}
      </motion.h2>
      {intro && (
        <motion.p variants={reveal} className="mt-4 max-w-prose text-lg text-muted">
          {intro}
        </motion.p>
      )}
    </motion.header>
  );
}
