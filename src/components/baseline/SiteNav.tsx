'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import ShortcutCycler from './ShortcutCycler';

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Sticky minimal top bar. On the home page, anchors smooth-scroll to sections
 * and scroll-spy lights the active one. On other routes they link back home.
 */
export default function SiteNav({ home = true }: { home?: boolean }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!home) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [home]);

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* scroll-progress rule */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px origin-left bg-signal"
        style={{ scaleX: progress }}
      />

      <div
        className={`transition-colors duration-300 ${
          scrolled ? 'border-b border-hair bg-base/70 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="shell flex h-16 items-center justify-between">
          {/* left: logo + command palette */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="group flex items-center gap-2 font-mono text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-signal transition-transform duration-300 group-hover:scale-125" />
              <span className="font-medium tracking-tight text-ink">anil sahith</span>
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
              aria-label="Open command palette"
              className="inline-flex items-center gap-3 rounded-lg border border-hair px-3 py-1.5 text-faint transition-colors duration-200 hover:border-signal/50 hover:text-signal sm:min-w-[10.5rem] sm:justify-between"
            >
              <span className="inline-flex items-center gap-1.5">
                <FaSearch size={12} />
                <span className="hidden font-mono text-xs sm:inline">Search</span>
              </span>
              <ShortcutCycler className="hidden sm:inline-flex" />
            </button>
          </div>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={href(s.id)}
                className={`relative px-3 py-2 font-mono text-sm transition-colors duration-200 ${
                  active === s.id ? 'text-signal' : 'text-muted hover:text-ink'
                }`}
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="/resume-match"
              className="px-3 py-2 font-mono text-sm text-muted transition-colors duration-200 hover:text-ink"
            >
              AI&nbsp;Match
            </Link>
            <a
              href="/resume_anil_sahith.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 rounded-lg border border-hair px-4 py-2 font-mono text-sm text-ink transition-colors duration-200 hover:border-signal/50 hover:text-signal"
            >
              Résumé
            </a>
          </div>

          {/* mobile: menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-md p-2 text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </nav>

        {/* mobile menu */}
        {menuOpen && (
          <div className="border-t border-hair bg-base/95 px-5 py-3 backdrop-blur-md md:hidden">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={href(s.id)}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-mono text-sm text-muted hover:text-signal"
              >
                {s.label}
              </Link>
            ))}
            <Link
              href="/resume-match"
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-mono text-sm text-muted hover:text-signal"
            >
              AI Resume Match
            </Link>
            <a
              href="/resume_anil_sahith.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-mono text-sm text-muted hover:text-signal"
            >
              Résumé
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
