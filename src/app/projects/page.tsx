import Link from 'next/link';
import type { Metadata } from 'next';
import { FaArrowLeft } from 'react-icons/fa';
import SiteNav from '@/components/baseline/SiteNav';
import SiteFooter from '@/components/baseline/SiteFooter';
import Reveal from '@/components/baseline/Reveal';
import ProjectGraph from '@/components/baseline/ProjectGraph';
import { getProjects } from '@/utils/content';

export const metadata: Metadata = {
  title: 'More Projects — Anil Sahith',
  description:
    'A connected graph of smaller ML, data, and systems projects — experiments, course work, and personal tools. Hover a node to explore.',
};

export default function MoreProjectsPage() {
  const projects = getProjects().filter((p) => !p.featured);

  return (
    <>
      <SiteNav home={false} />
      <main className="shell relative min-h-screen pb-24 pt-32">
        <div className="ambient-glow left-[-6%] top-[3%] h-[26rem] w-[26rem] opacity-[0.1]" aria-hidden />

        <Link
          href="/#work"
          className="relative inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-signal"
        >
          <FaArrowLeft size={11} /> back to home
        </Link>

        <header className="relative mt-10 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-signal/60" aria-hidden />
            <span className="stamp text-signal">Archive</span>
          </div>
          <h1 className="text-h2 font-semibold tracking-tight text-ink">More projects</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Beyond the featured builds — a connected map of smaller ML, data, and systems projects:
            experiments, course work, and personal tools. Hover a node to explore it.
          </p>
          <p className="mt-3 font-mono text-xs text-faint">
            <span className="text-signal">{projects.length}</span> connected projects
          </p>
        </header>

        <Reveal className="relative mt-12">
          <ProjectGraph projects={projects} />
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
