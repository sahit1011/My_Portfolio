'use client';

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { getPersonalInfo, getGithubUrl, getLinkedinUrl } from '@/utils/content';

export default function SiteFooter() {
  const info = getPersonalInfo();
  const year = new Date().getFullYear();
  const mailto = `mailto:${info.email}`;

  return (
    <footer className="border-t border-hair">
      <div className="shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-faint">
          © {year} {info.name} — built with Next.js &amp; Tailwind.
        </p>
        <div className="flex items-center gap-5 text-muted">
          <a href={getGithubUrl()} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-signal">
            <FaGithub size={18} />
          </a>
          <a href={getLinkedinUrl()} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-signal">
            <FaLinkedin size={18} />
          </a>
          <a href={mailto} aria-label="Email" className="transition-colors hover:text-signal">
            <FaEnvelope size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
