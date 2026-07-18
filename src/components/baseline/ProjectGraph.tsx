'use client';

import { useMemo, useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import type { Project } from '@/utils/content';

const cleanTitle = (t: string) => t.split(' - ')[0].split(' — ')[0];
const shortLabel = (t: string) => {
  const c = cleanTitle(t);
  return c.length > 17 ? c.slice(0, 16).trimEnd() + '…' : c;
};

interface Pt {
  x: number;
  y: number;
}

/** Deterministic phyllotaxis (golden-angle) scatter in a 0..1 box. */
function layout(n: number): Pt[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const r = Math.sqrt((i + 0.5) / n) * 0.44;
    const a = i * golden;
    pts.push({ x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r });
  }
  return pts;
}

/** Connect each node to its k nearest neighbours → an organic mesh. */
function meshEdges(pts: Pt[], k = 2): Array<[number, number]> {
  const seen = new Set<string>();
  const out: Array<[number, number]> = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: (q.x - p.x) ** 2 + (q.y - p.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    near.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push([i, j]);
      }
    });
  });
  return out;
}

export default function ProjectGraph({ projects }: { projects: Project[] }) {
  const pts = useMemo(() => layout(projects.length), [projects.length]);
  const edges = useMemo(() => meshEdges(pts, 2), [pts]);
  const [active, setActive] = useState(0);

  const connected = useMemo(() => {
    const s = new Set<number>();
    edges.forEach(([a, b]) => {
      if (a === active) s.add(b);
      if (b === active) s.add(a);
    });
    return s;
  }, [edges, active]);

  const p = projects[active];
  const hasGithub = p?.github && p.github !== '#';

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
      {/* graph */}
      <div className="relative h-[56vh] min-h-[440px] overflow-hidden rounded-2xl border border-hair bg-surface/40 lg:h-[64vh]">
        <div className="ambient-glow left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" aria-hidden />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
          {edges.map(([a, b], i) => {
            const on = a === active || b === active;
            return (
              <line
                key={i}
                x1={`${pts[a].x * 100}%`}
                y1={`${pts[a].y * 100}%`}
                x2={`${pts[b].x * 100}%`}
                y2={`${pts[b].y * 100}%`}
                stroke={on ? 'rgba(127,224,194,0.5)' : 'rgba(127,224,194,0.13)'}
                strokeWidth={on ? 1.4 : 1}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {pts.map((pt, i) => {
          const isActive = i === active;
          const near = connected.has(i);
          return (
            <button
              key={projects[i].id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%` }}
              className={`group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 outline-none ${
                isActive ? 'z-[3]' : 'z-[2]'
              }`}
              aria-label={cleanTitle(projects[i].title)}
            >
              <span
                className={`block rounded-full transition-all duration-300 group-hover:scale-125 group-focus-visible:scale-125 ${
                  isActive
                    ? 'h-4 w-4 bg-signal shadow-[0_0_22px_-2px_rgba(127,224,194,0.85)]'
                    : near
                      ? 'h-3 w-3 bg-signal/80'
                      : 'h-2.5 w-2.5 bg-signal/45'
                }`}
              />
              <span
                className={`pointer-events-none whitespace-nowrap font-mono text-[10px] leading-none transition-colors duration-300 ${
                  isActive ? 'text-ink' : near ? 'text-muted' : 'text-faint'
                } group-hover:text-ink`}
              >
                {shortLabel(projects[i].title)}
              </span>
            </button>
          );
        })}
      </div>

      {/* detail panel — follows the hovered / tapped node */}
      <div className="relative flex flex-col rounded-2xl border border-hair bg-surface p-6 lg:p-8">
        {p && (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-signal/60" aria-hidden />
              <span className="stamp text-signal">{p.tag ?? 'Project'}</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink">
              {cleanTitle(p.title)}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{p.description[0]}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {p.technologies.slice(0, 6).map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
              {p.technologies.length > 6 && (
                <span className="chip border-transparent text-faint">+{p.technologies.length - 6}</span>
              )}
            </div>

            <div className="mt-auto flex items-center gap-4 pt-8 font-mono text-xs">
              {hasGithub && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-signal"
                >
                  <FaGithub /> Source
                </a>
              )}
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-signal"
                >
                  <FaExternalLinkAlt size={11} /> Live
                </a>
              )}
              {!hasGithub && !p.demo && <span className="text-faint">private project</span>}
              <span className="ml-auto text-faint">
                {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
