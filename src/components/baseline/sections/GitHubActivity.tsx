'use client';

import { useEffect, useState } from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaArrowRight } from 'react-icons/fa';
import Reveal, { RevealItem } from '../Reveal';
import SectionHeader from './SectionHeader';
import { getGithubUsername, getGithubUrl } from '@/utils/content';

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
};

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Calendar = { user: string; label: string; days: Day[]; total: number };

const LEVELS = ['bg-white/[0.05]', 'bg-signal/25', 'bg-signal/45', 'bg-signal/70', 'bg-signal'];

function ContribGraph({ days }: { days: Day[] }) {
  const leadPad = days.length ? new Date(days[0].date).getDay() : 0;
  return (
    <div className="overflow-x-auto scrollbar-thin pb-1">
      <div className="grid w-max gap-[3px]" style={{ gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 11px)' }}>
        {Array.from({ length: leadPad }).map((_, i) => (
          <div key={`pad-${i}`} className="h-[11px] w-[11px]" />
        ))}
        {days.map((d) => (
          <div
            key={d.date}
            title={`${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`}
            className={`h-[11px] w-[11px] rounded-[2px] ${LEVELS[d.level]}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function GitHubActivity() {
  const primary = getGithubUsername();
  const ACCOUNTS = [
    { user: primary, label: 'Personal' },
    { user: 'anilsahit-ah', label: 'Work' },
  ];

  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [cals, setCals] = useState<Calendar[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // repos (primary account)
    (async () => {
      try {
        const r: Repo[] = await (await fetch(`https://api.github.com/users/${primary}/repos?sort=updated&per_page=100`)).json();
        if (cancelled) return;
        setRepos(
          r.filter((x) => !x.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || b.id - a.id)
            .slice(0, 6)
        );
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    // contribution calendars (both accounts)
    (async () => {
      const results = await Promise.all(
        ACCOUNTS.map(async (a) => {
          try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${a.user}?y=last`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            const days: Day[] = data.contributions ?? [];
            const total =
              data.total?.lastYear ??
              Object.values(data.total ?? {}).reduce((s: number, n) => s + (n as number), 0);
            return { user: a.user, label: a.label, days, total: typeof total === 'number' ? total : 0 } as Calendar;
          } catch {
            return null;
          }
        })
      );
      if (!cancelled) setCals(results.filter(Boolean) as Calendar[]);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary]);

  return (
    <section id="github" className="scroll-mt-20 border-t border-hair py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          stamp="Open Source"
          title="On GitHub"
          intro="What I've been building and shipping — across my personal and work accounts, pulled live from GitHub."
        />

        {/* contribution graphs — both accounts */}
        {cals && cals.length > 0 && (
          <Reveal stagger className="mb-10 space-y-5">
            {cals.map((c) => (
              <RevealItem key={c.user} className="overflow-hidden rounded-2xl border border-hair bg-surface p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`https://github.com/${c.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-mono text-sm text-ink transition-colors hover:text-signal"
                  >
                    <FaGithub className="text-muted transition-colors group-hover:text-signal" />
                    @{c.user}
                    <span className="rounded border border-hair px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-faint">
                      {c.label}
                    </span>
                  </a>
                  <span className="font-mono text-xs text-muted">
                    <span className="text-signal">{c.total}</span> contributions · last year
                  </span>
                </div>
                <ContribGraph days={c.days} />
              </RevealItem>
            ))}
            {/* legend */}
            <div className="flex items-center justify-end gap-1.5 font-mono text-[10px] text-faint">
              <span>less</span>
              {LEVELS.map((cl, i) => (
                <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cl}`} />
              ))}
              <span>more</span>
            </div>
          </Reveal>
        )}

        {/* repos */}
        {error ? (
          <Reveal className="rounded-2xl border border-hair bg-surface p-8 text-center">
            <p className="text-muted">Couldn&apos;t load live data right now.</p>
            <a
              href={getGithubUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-signal hover:underline"
            >
              <FaGithub /> View GitHub profile
            </a>
          </Reveal>
        ) : !repos ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl border border-hair bg-surface" />
            ))}
          </div>
        ) : (
          <Reveal stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <RevealItem key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-xl border border-hair bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-hair-strong hover:bg-elevated"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <FaGithub className="text-muted" />
                    <span className="flex items-center gap-3 font-mono text-xs text-faint">
                      {repo.stargazers_count > 0 && (
                        <span className="inline-flex items-center gap-1"><FaStar size={10} /> {repo.stargazers_count}</span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="inline-flex items-center gap-1"><FaCodeBranch size={10} /> {repo.forks_count}</span>
                      )}
                    </span>
                  </div>
                  <h3 className="font-mono text-sm font-medium text-ink transition-colors group-hover:text-signal">
                    {repo.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
                    {repo.description || 'No description provided.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {repo.language ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                        <span className="h-2 w-2 rounded-full bg-signal" /> {repo.language}
                      </span>
                    ) : <span />}
                    <FaArrowRight size={11} className="text-faint transition-all group-hover:translate-x-0.5 group-hover:text-signal" />
                  </div>
                </a>
              </RevealItem>
            ))}
          </Reveal>
        )}

        <Reveal className="mt-8 text-center">
          <a
            href={getGithubUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-signal"
          >
            <FaGithub /> See all on GitHub <FaArrowRight size={11} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
