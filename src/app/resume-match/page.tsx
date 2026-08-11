'use client';

import { useState, useCallback } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import {
  FaSpinner, FaTimes, FaLink, FaFileUpload, FaFileAlt, FaClipboard,
  FaGithub, FaExternalLinkAlt, FaArrowRight, FaCheck,
} from 'react-icons/fa';
import SiteNav from '@/components/baseline/SiteNav';
import SiteFooter from '@/components/baseline/SiteFooter';
import MagneticButton from '@/components/baseline/MagneticButton';
import ScoreMeter from '@/components/baseline/ScoreMeter';
import { reveal, viewportOnce } from '@/components/baseline/motion';

type InputMethod = 'text' | 'url' | 'file';

interface SkillMatch { skill: string; match: number; required: boolean }
interface RecProject {
  id: number; title: string; description: string[];
  technologies: string[]; github: string; demo?: string;
}
interface AnalysisResult {
  overallMatch: number;
  skillsMatch: SkillMatch[];
  missingSkills: string[];
  candidateSummary: string;
  warnings?: string[];
  recommendedProjects: RecProject[];
  // Set when no AI provider was reachable and the scores are placeholders.
  simulated?: boolean;
}

const SAMPLE_JD = `Senior AI/ML Engineer

We're hiring an ML engineer to build and ship production machine learning systems.

Responsibilities:
- Design, train and deploy deep learning models (CV / NLP)
- Build data and inference pipelines; optimize models for latency and cost
- Ship full-stack ML features (Python backend + React frontend)
- Work with LLMs / agentic systems and vector search

Requirements:
- Strong Python; experience with PyTorch or TensorFlow
- Experience deploying models to production (Docker, cloud)
- Familiarity with React/Next.js and REST APIs
- Bonus: edge/embedded ML, LangChain, RAG`;

export default function ResumeMatchPage() {
  const [tab, setTab] = useState<InputMethod>('text');
  const [jd, setJd] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [urlFetching, setUrlFetching] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const fetchFromUrl = async (u: string) => {
    setUrlFetching(true); setError(null);
    try {
      const r = await fetch('/api/fetch-job-description', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u }),
      });
      if (!r.ok) throw new Error();
      return (await r.json()).text as string;
    } catch {
      setError('Could not fetch that URL. Paste the text instead.');
      return null;
    } finally { setUrlFetching(false); }
  };

  const extractFromFile = async (f: File) => {
    setFileProcessing(true); setError(null);
    try {
      const fd = new FormData(); fd.append('file', f);
      const r = await fetch('/api/extract-file-text', { method: 'POST', body: fd });
      if (!r.ok) throw new Error();
      return (await r.json()).text as string;
    } catch {
      setError('Could not read that file. Try pasting the text.');
      return null;
    } finally { setFileProcessing(false); }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files?.length) setFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let text = '';

    if (tab === 'text') {
      if (!jd.trim()) return setError('Paste a job description first.');
      text = jd;
    } else if (tab === 'url') {
      if (!url.trim()) return setError('Enter a URL first.');
      const t = await fetchFromUrl(url); if (!t) return; text = t;
    } else {
      if (!file) return setError('Upload a file first.');
      const t = await extractFromFile(file); if (!t) return; text = t;
    }

    setLoading(true);
    try {
      const r = await fetch('/api/resume-match', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) throw new Error();
      setResults(await r.json());
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 80);
    } catch {
      setError('Analysis failed. Please try again in a moment.');
    } finally { setLoading(false); }
  };

  const tabs: { id: InputMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'text', label: 'Paste', icon: <FaClipboard /> },
    { id: 'url', label: 'URL', icon: <FaLink /> },
    { id: 'file', label: 'File', icon: <FaFileUpload /> },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <SiteNav home={false} />
      <main className="shell min-h-screen pt-32">
        {/* header */}
        <motion.div variants={reveal} initial="hidden" animate="show" className="max-w-prose">
          <p className="stamp mb-4 text-signal">AI Resume Match</p>
          <h1 className="text-h2 font-semibold text-ink">See how I fit your role</h1>
          <p className="mt-4 text-lg text-muted">
            Paste a job description and an AI model scores my profile against it —
            matched skills, gaps, and an overall fit read. Runs on a real model,
            server-side. It&apos;s a small demo of the applied-AI tooling I build.
          </p>
        </motion.div>

        {/* input panel */}
        <motion.form
          onSubmit={handleSubmit}
          variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce}
          className="panel mt-10 p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-sm transition-colors ${
                  tab === t.id ? 'bg-elevated text-signal' : 'text-muted hover:text-ink'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setTab('text'); setJd(SAMPLE_JD); }}
              className="ml-auto font-mono text-xs text-faint underline-offset-4 hover:text-signal hover:underline"
            >
              Try a sample JD
            </button>
          </div>

          {tab === 'text' && (
            <textarea
              value={jd} onChange={(e) => setJd(e.target.value)} rows={10}
              placeholder="Paste the job description here…"
              className="w-full resize-y rounded-lg border border-hair bg-base p-4 font-mono text-sm text-ink placeholder:text-faint focus:border-signal/50 focus:outline-none"
            />
          )}

          {tab === 'url' && (
            <div className="flex gap-2">
              <input
                type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…/jobs/view/…"
                className="flex-1 rounded-lg border border-hair bg-base px-4 py-3 font-mono text-sm text-ink placeholder:text-faint focus:border-signal/50 focus:outline-none"
              />
              <button
                type="button" disabled={urlFetching}
                onClick={async () => { const t = await fetchFromUrl(url); if (t) { setJd(t); setTab('text'); } }}
                className="rounded-lg border border-hair px-4 font-mono text-sm text-ink hover:border-signal/50 hover:text-signal"
              >
                {urlFetching ? <FaSpinner className="animate-spin" /> : 'Fetch'}
              </button>
            </div>
          )}

          {tab === 'file' && (
            <div
              onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('jd-file')?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-hair p-8 text-center transition-colors hover:border-signal/50"
            >
              <input id="jd-file" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
              {file ? (
                <span className="inline-flex items-center gap-2 font-mono text-sm text-ink">
                  <FaFileAlt className="text-signal" /> {file.name}
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-warn"><FaTimes /></button>
                </span>
              ) : (
                <>
                  <FaFileUpload className="mx-auto mb-2 text-2xl text-faint" />
                  <p className="text-muted">Drop a file or click to upload</p>
                  <p className="mt-1 font-mono text-xs text-faint">PDF · DOC · TXT</p>
                </>
              )}
              {fileProcessing && <p className="mt-3 font-mono text-xs text-signal"><FaSpinner className="mr-1 inline animate-spin" /> reading…</p>}
            </div>
          )}

          {error && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-warn/30 bg-warn/5 px-3 py-2 font-mono text-sm text-warn">
              <FaTimes /> {error}
            </p>
          )}

          <div className="mt-6">
            <MagneticButton type="submit" variant="solid">
              {loading ? <><FaSpinner className="animate-spin" /> Analyzing…</> : <>Run match <FaArrowRight /></>}
            </MagneticButton>
          </div>
        </motion.form>

        {/* loading skeleton */}
        {loading && !results && (
          <div className="panel mt-8 animate-pulse p-8">
            <div className="h-2 w-40 rounded bg-elevated" />
            <div className="mt-4 h-8 w-full rounded bg-elevated" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 rounded bg-elevated" />)}
            </div>
          </div>
        )}

        {/* results */}
        {results && (
          <motion.div
            id="results" variants={reveal} initial="hidden" animate="show"
            className="mt-8 space-y-8 pb-24"
          >
            {results.simulated && (
              <div className="rounded-xl border border-warn/30 bg-warn/5 p-6">
                <p className="stamp mb-3 text-warn">AI analysis unavailable</p>
                <p className="text-muted">
                  No AI provider could be reached, so the scores below are randomly
                  generated placeholders — not a real assessment of this job
                  description. Please try again later.
                </p>
              </div>
            )}

            <div className="panel p-6 sm:p-8">
              <ScoreMeter value={results.overallMatch} />
              {results.candidateSummary && (
                <p className="mt-6 border-l-2 border-signal/40 pl-4 text-muted">
                  {results.candidateSummary}
                </p>
              )}
            </div>

            {results.warnings && results.warnings.length > 0 && (
              <div className="rounded-xl border border-warn/30 bg-warn/5 p-6">
                <p className="stamp mb-3 text-warn">Notes</p>
                <ul className="space-y-1.5 text-sm text-warn/90">
                  {results.warnings.map((w, i) => <li key={i}>— {w}</li>)}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="panel p-6">
                <p className="stamp mb-4 text-signal">Matched skills</p>
                <div className="flex flex-wrap gap-2">
                  {results.skillsMatch.filter((s) => s.match >= 70).map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-md border border-signal/30 bg-signal/5 px-2.5 py-1 font-mono text-xs text-signal">
                      <FaCheck size={9} /> {s.skill}
                    </span>
                  ))}
                  {results.skillsMatch.filter((s) => s.match >= 70).length === 0 && (
                    <span className="font-mono text-xs text-faint">—</span>
                  )}
                </div>
              </div>

              <div className="panel p-6">
                <p className="stamp mb-4 text-warn">Gaps</p>
                <div className="flex flex-wrap gap-2">
                  {results.missingSkills.length > 0 ? results.missingSkills.map((s, i) => (
                    <span key={i} className="rounded-md border border-warn/30 bg-warn/5 px-2.5 py-1 font-mono text-xs text-warn">{s}</span>
                  )) : <span className="font-mono text-xs text-faint">None flagged</span>}
                </div>
              </div>
            </div>

            {results.recommendedProjects?.length > 0 && (
              <div>
                <p className="stamp mb-4">Relevant projects</p>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {results.recommendedProjects.map((p) => (
                    <div key={p.id} className="panel flex flex-col p-6">
                      <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted">{p.description.join(' ')}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.technologies.slice(0, 6).map((t) => <span key={t} className="chip">{t}</span>)}
                      </div>
                      <div className="mt-4 flex items-center gap-4 font-mono text-xs">
                        {p.github && p.github !== '#' && (
                          <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-signal"><FaGithub /> Source</a>
                        )}
                        {p.demo && (
                          <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-signal"><FaExternalLinkAlt size={11} /> Live</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}
