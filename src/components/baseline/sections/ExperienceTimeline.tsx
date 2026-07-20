'use client';

import { useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import Reveal from '../Reveal';
import SectionHeader from './SectionHeader';
import { getExperiences } from '@/utils/content';

export default function ExperienceTimeline() {
  const experiences = getExperiences();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const amount = card ? card.clientWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <section id="experience" className="scroll-mt-20 border-t border-hair py-16 sm:py-20">
      <div className="shell">
        <SectionHeader
          stamp="Experience"
          title="Where I've shipped"
          intro="Production work across applied ML, data infra, and AI product teams."
        />

        <Reveal>
          {/* swipe / drag-scroll on touch + trackpad; arrows for the rest */}
          <div
            ref={trackRef}
            className="scrollbar-none flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-2"
          >
            {experiences.map((exp, i) => {
              const points = exp.highlights ?? exp.description;
              return (
                <article
                  key={exp.id}
                  className="relative flex min-h-[24rem] w-[90%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-hair bg-surface p-7 sm:w-[85%] sm:p-10 lg:w-[74%]"
                >
                  {/* big faded index */}
                  <span className="pointer-events-none absolute -right-1 top-0 select-none font-mono text-[7rem] font-bold leading-none text-white/[0.03] sm:text-[9rem]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="ambient-glow left-[-8%] top-[-30%] h-[22rem] w-[22rem] opacity-[0.1]" aria-hidden />

                  <div className="relative">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="chip border-hair text-muted">{exp.period}</span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-faint">
                        <FaMapMarkerAlt size={11} /> {exp.location}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                      {exp.title}
                      <span className="text-faint"> @ </span>
                      <span className="text-signal">{exp.company}</span>
                    </h3>

                    {exp.summary && (
                      <p className="mt-3 max-w-prose text-lg text-muted">{exp.summary}</p>
                    )}

                    <ul className="mt-6 space-y-3">
                      {points.map((p, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <FaArrowRight className="mt-1.5 shrink-0 text-signal" size={12} />
                          <span className="text-ink/90">{p}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {exp.skills.map((s) => (
                        <span key={s} className="chip">{s}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="w-1 shrink-0" aria-hidden />
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => scrollByCards(-1)}
                aria-label="Previous experience"
                className="rounded-lg border border-hair p-2.5 text-muted transition-colors hover:border-signal/50 hover:text-signal"
              >
                <FaArrowLeft size={13} />
              </button>
              <button
                onClick={() => scrollByCards(1)}
                aria-label="Next experience"
                className="rounded-lg border border-hair p-2.5 text-muted transition-colors hover:border-signal/50 hover:text-signal"
              >
                <FaArrowRight size={13} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
