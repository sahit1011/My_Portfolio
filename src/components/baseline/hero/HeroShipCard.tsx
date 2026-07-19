'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import CardCover from '../CardCover';
import { EASE_OUT } from '../motion';
import { getProjects, getProjectSlug } from '@/utils/content';

/**
 * "Latest ship" card for the hero's right column — the first featured project
 * playing its muted demo loop, linking straight to the case study. Real,
 * working software in the first second of the visit.
 */
export default function HeroShipCard() {
  const ship = getProjects().find((p) => p.featured);
  if (!ship) return null;
  const slug = getProjectSlug(ship);
  const title = ship.title.split(' - ')[0].split(' — ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
      className="w-full max-w-[26rem]"
    >
      <Link
        href={`/projects/${slug}`}
        className="group block overflow-hidden rounded-2xl border border-hair bg-surface/80 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur transition-colors duration-300 hover:border-signal/40"
      >
        <div className="relative aspect-video w-full overflow-hidden border-b border-hair">
          <CardCover
            video={ship.previewVideo}
            preview={ship.preview}
            title={title}
            label={ship.tag}
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="stamp text-signal">Latest ship</p>
            <p className="mt-1 truncate font-display text-base font-semibold text-ink">
              {title}
              <span className="ml-2 hidden font-sans text-sm font-normal text-muted xl:inline">
                {ship.tag}
              </span>
            </p>
          </div>
          <FaArrowRight
            size={13}
            className="ml-auto shrink-0 text-signal transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}
