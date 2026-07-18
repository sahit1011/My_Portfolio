'use client';

import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaLayerGroup, FaBriefcase, FaUser, FaEnvelope, FaFilePdf,
  FaGithub, FaLinkedin, FaRobot, FaTerminal, FaArrowRight, FaTimes, FaCopy, FaCheck,
} from 'react-icons/fa';
import {
  getPersonalInfo, getGithubUrl, getLinkedinUrl, getProjects, getProjectSlug,
} from '@/utils/content';
import { startLenis, stopLenis } from './lenisInstance';

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), { ssr: false });

type Cmd = {
  id: string;
  label: string;
  group: string;
  icon: ReactNode;
  hint?: string;
  keywords?: string;
  run: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const info = getPersonalInfo();

  const [open, setOpen] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => setOpen(false);
  const go = (href: string) => { close(); router.push(href); };
  const openUrl = (u: string) => { close(); window.open(u, '_blank', 'noopener,noreferrer'); };
  const copyEmail = () => {
    navigator.clipboard?.writeText(info.email);
    setCopied(true);
    setTimeout(() => { setCopied(false); close(); }, 850);
  };

  const commands: Cmd[] = useMemo(() => {
    const nav: Cmd[] = [
      { id: 'home', label: 'Home', group: 'Navigate', icon: <FaHome />, run: () => go('/') },
      { id: 'work', label: 'Selected Work', group: 'Navigate', icon: <FaLayerGroup />, run: () => go('/#work') },
      { id: 'exp', label: 'Experience', group: 'Navigate', icon: <FaBriefcase />, run: () => go('/#experience') },
      { id: 'about', label: 'About', group: 'Navigate', icon: <FaUser />, run: () => go('/#about') },
      { id: 'contact', label: 'Contact', group: 'Navigate', icon: <FaEnvelope />, run: () => go('/#contact') },
    ];
    const pages: Cmd[] = [
      { id: 'match', label: 'AI Resume Match', group: 'Pages', icon: <FaRobot />, keywords: 'jd job fit', run: () => go('/resume-match') },
      { id: 'resume', label: 'Résumé (PDF)', group: 'Pages', icon: <FaFilePdf />, keywords: 'cv download', run: () => openUrl('/resume_anil_sahith.pdf') },
    ];
    const projects: Cmd[] = getProjects().map((p) => ({
      id: `proj-${p.id}`,
      label: p.title.split(' - ')[0].split(' — ')[0],
      group: 'Projects',
      icon: <FaArrowRight size={11} />,
      keywords: `${p.tag ?? ''} project case study`,
      run: () => go(`/projects/${getProjectSlug(p)}`),
    }));
    const actions: Cmd[] = [
      { id: 'copy', label: copied ? 'Copied!' : 'Copy email', group: 'Actions', icon: copied ? <FaCheck className="text-signal" /> : <FaCopy />, keywords: 'mail contact', run: copyEmail },
      { id: 'gh', label: 'GitHub', group: 'Actions', icon: <FaGithub />, run: () => openUrl(getGithubUrl()) },
      { id: 'li', label: 'LinkedIn', group: 'Actions', icon: <FaLinkedin />, run: () => openUrl(getLinkedinUrl()) },
    ];
    const fun: Cmd[] = [
      { id: 'term', label: '$ terminal mode', group: 'Fun', icon: <FaTerminal />, hint: 'easter egg', keywords: 'cli shell secret', run: () => { close(); setShowTerminal(true); } },
    ];
    return [...nav, ...pages, ...projects, ...actions, ...fun];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q)
    );
  }, [query, commands]);

  // group for display, preserving order
  const groups = useMemo(() => {
    const map = new Map<string, Cmd[]>();
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // open/close hotkeys + external open event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
        setShowTerminal(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
    else setQuery('');
  }, [open]);

  // lock background scroll while the palette or terminal is open.
  // Lenis drives scroll via JS and ignores overflow:hidden, so pause it too.
  useEffect(() => {
    const locked = open || showTerminal;
    document.body.style.overflow = locked ? 'hidden' : '';
    if (locked) stopLenis();
    else startLenis();
    return () => {
      document.body.style.overflow = '';
      startLenis();
    };
  }, [open, showTerminal]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.run(); }
  };

  // flat index for active highlight
  let flatIndex = -1;

  return (
    <>
      {/* command palette */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-base/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              role="dialog" aria-modal="true"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl border border-hair bg-surface shadow-2xl"
              onKeyDown={onListKey}
            >
              {/* input */}
              <div className="flex items-center gap-3 border-b border-hair px-4">
                <span className="font-mono text-sm text-signal">$</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or jump to…"
                  className="w-full bg-transparent py-4 font-mono text-sm text-ink placeholder:text-faint focus:outline-none"
                />
                <kbd className="rounded border border-hair px-1.5 py-0.5 font-mono text-[10px] text-faint">esc</kbd>
              </div>

              {/* list */}
              <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin" data-lenis-prevent>
                {groups.length === 0 && (
                  <p className="px-3 py-6 text-center font-mono text-sm text-faint">no matches</p>
                )}
                {groups.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <p className="stamp px-3 py-1.5">{group}</p>
                    {items.map((c) => {
                      flatIndex += 1;
                      const isActive = flatIndex === active;
                      const myIndex = flatIndex;
                      return (
                        <button
                          key={c.id}
                          onMouseEnter={() => setActive(myIndex)}
                          onClick={() => c.run()}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            isActive ? 'bg-elevated text-ink' : 'text-muted'
                          }`}
                        >
                          <span className={`text-sm ${isActive ? 'text-signal' : 'text-faint'}`}>{c.icon}</span>
                          <span className="flex-1 text-sm">{c.label}</span>
                          {c.hint && <span className="font-mono text-[10px] text-faint">{c.hint}</span>}
                          {isActive && <FaArrowRight size={10} className="text-signal" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="flex items-center gap-4 border-t border-hair px-4 py-2.5 font-mono text-[10px] text-faint">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* secret terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 py-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            data-lenis-prevent
          >
            <div className="fixed inset-0 z-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowTerminal(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="relative z-10 my-auto w-full max-w-4xl"
            >
              <button
                onClick={() => setShowTerminal(false)}
                aria-label="Close terminal"
                className="absolute -top-10 right-0 inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-signal"
              >
                close <FaTimes />
              </button>
              <Terminal />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
