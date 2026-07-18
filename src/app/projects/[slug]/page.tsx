import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import SiteNav from '@/components/baseline/SiteNav';
import SiteFooter from '@/components/baseline/SiteFooter';
import DemoPlayer from '@/components/baseline/DemoPlayer';
import { getProjects, getProjectBySlug, getProjectSlug } from '@/utils/content';

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: getProjectSlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project — Anil Sahith' };
  const title = project.title.split(' - ')[0].split(' — ')[0];
  return { title: `${title} — Anil Sahith`, description: project.description[0] };
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const all = getProjects();
  const idx = all.findIndex((p) => getProjectSlug(p) === slug);
  const next = all[(idx + 1) % all.length];
  const title = project.title.split(' - ')[0].split(' — ')[0];
  const num = String(idx + 1).padStart(2, '0');
  const hasGithub = project.github && project.github !== '#';

  return (
    <>
      <SiteNav home={false} />
      <main className="shell relative min-h-screen pt-32">
        <div className="ambient-glow left-[-5%] top-[4%] h-[28rem] w-[28rem] opacity-[0.12]" aria-hidden />

        {/* header */}
        <div className="relative">
          <Link href="/#work" className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-signal">
            <FaArrowLeft size={11} /> back to work
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-signal/30 bg-signal/5 px-3 py-1 font-mono text-xs text-signal">
              {project.tag ?? 'Project'}
            </span>
            <span className="stamp text-faint">project {num}</span>
          </div>
          <h1 className="mt-5 max-w-[22ch] text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hasGithub && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 font-mono text-sm font-medium text-base transition-all hover:bg-signal-light hover:shadow-[0_0_24px_-6px_rgba(127,224,194,0.55)]">
                <FaGithub /> View source
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-lg border border-hair px-5 py-3 font-mono text-sm text-ink transition-colors hover:border-signal/50 hover:text-signal">
                <FaExternalLinkAlt size={12} /> Live demo
              </a>
            )}
            {!hasGithub && !project.demo && <span className="status-pill">Private / in progress</span>}
          </div>
        </div>

        {/* body — media and overview balanced side by side (media sticky on desktop) */}
        <div className="relative mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          {/* media */}
          <div className="lg:order-2 lg:sticky lg:top-28">
            <DemoPlayer
              video={project.demoVideo}
              preview={project.preview}
              title={title}
              label={project.tag}
              index={num}
            />
            {project.demoVideo && (
              <p className="mt-3 text-center font-mono text-xs text-faint">
                Live demo recording — press play
              </p>
            )}
          </div>

          {/* overview + built-with */}
          <div className="lg:order-1">
            <p className="stamp mb-5">Overview</p>
            <ul className="space-y-4">
              {project.description.map((d, i) => (
                <li key={i} className="flex gap-3 text-lg leading-relaxed text-muted">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-hair pt-8">
              <p className="stamp mb-4">Built with</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* next */}
        <div className="relative mt-20 border-t border-hair py-10">
          <Link href={`/projects/${getProjectSlug(next)}`} className="group flex items-center justify-between gap-4">
            <div>
              <p className="stamp mb-1">Next project</p>
              <p className="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-signal">
                {next.title.split(' - ')[0].split(' — ')[0]}
              </p>
            </div>
            <FaArrowRight className="shrink-0 text-signal transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
