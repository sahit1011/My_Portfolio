'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Reveal from '../Reveal';
import SpotlightCard from '../SpotlightCard';
import CardCover from '../CardCover';
import SectionHeader from './SectionHeader';
import { getProjects, getProjectSlug, type Project } from '@/utils/content';

const cleanTitle = (t: string) => t.split(' - ')[0].split(' — ')[0];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const slug = getProjectSlug(project);
  const title = cleanTitle(project.title);
  const num = String(index).padStart(2, '0');
  const hasGithub = project.github && project.github !== '#';

  return (
    <SpotlightCard tilt className="w-[86%] shrink-0 snap-start rounded-2xl border border-hair bg-surface transition-colors duration-300 hover:border-hair-strong sm:w-[58%] lg:w-[46%] xl:w-[40%]">
      <span className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-px scale-x-0 bg-gradient-to-r from-transparent via-signal to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100" />

      {/* cover — looping muted preview video if available, else the image */}
      <Link
        href={`/projects/${slug}`}
        className="relative block aspect-video w-full overflow-hidden border-b border-hair"
      >
        <CardCover
          video={project.previewVideo}
          preview={project.preview}
          title={title}
          label={project.tag}
          index={num}
        />
      </Link>

      {/* body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="stamp text-faint">
            {num}
            {project.tag && <span className="ml-2 text-muted">{project.tag}</span>}
          </span>
          {project.featured && <span className="stamp shrink-0 text-signal">featured</span>}
        </div>

        <Link href={`/projects/${slug}`} className="flex items-start gap-2">
          <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-signal">
            {title}
          </h3>
          <FaArrowRight
            size={13}
            className="mt-1.5 shrink-0 -translate-x-2 text-signal opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </Link>

        <p className="mt-2 line-clamp-2 text-sm text-muted">{project.description[0]}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
          {project.technologies.length > 4 && (
            <span className="chip border-transparent text-faint">+{project.technologies.length - 4}</span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-hair pt-4">
          <Link href={`/projects/${slug}`} className="link-grow font-mono text-xs text-signal">
            Case study →
          </Link>
          <div className="flex items-center gap-4 font-mono text-xs">
            {hasGithub && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-signal">
                <FaGithub /> Source
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-signal">
                <FaExternalLinkAlt size={11} /> Live
              </a>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function SelectedWork() {
  const featured = getProjects().filter((p) => p.featured);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const amount = card ? card.clientWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <section id="work" className="scroll-mt-20 border-t border-hair py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          stamp="Selected Work"
          title="Things I've built"
          intro="Applied ML, agentic systems, and full-stack products — shipped end to end."
        />

        <Reveal>
          <div
            ref={trackRef}
            className="scrollbar-none flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-2"
          >
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i + 1} />
            ))}
            <div className="w-1 shrink-0" aria-hidden />
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-lg border border-hair px-5 py-3 font-mono text-sm text-ink transition-colors hover:border-signal/50 hover:text-signal"
            >
              View more projects
              <FaArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => scrollByCards(-1)}
                aria-label="Previous projects"
                className="rounded-lg border border-hair p-2.5 text-muted transition-colors hover:border-signal/50 hover:text-signal"
              >
                <FaArrowLeft size={13} />
              </button>
              <button
                onClick={() => scrollByCards(1)}
                aria-label="Next projects"
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
