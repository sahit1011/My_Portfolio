'use client';

import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import Reveal from '../Reveal';
import MagneticButton from '../MagneticButton';
import SectionHeader from './SectionHeader';
import { getPersonalInfo, getGithubUrl, getLinkedinUrl, getEmailComposeUrl } from '@/utils/content';

export default function ContactSection() {
  const info = getPersonalInfo();
  const emailCompose = getEmailComposeUrl();

  return (
    <section id="contact" className="shell scroll-mt-20 border-t border-hair py-16 sm:py-20">
      <SectionHeader stamp="Contact" title="Let's build something." />

      <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="max-w-prose text-lg text-muted">
            I&apos;m open to full-time roles, freelance, and interesting collaborations
            in AI/ML and full-stack engineering. The fastest way to reach me is email.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton href={emailCompose} variant="solid" external>
              {info.email} <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>
          </div>

          <div className="mt-8 flex items-center gap-6 text-muted">
            <a href={getGithubUrl()} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-signal">
              <FaGithub size={20} />
            </a>
            <a href={getLinkedinUrl()} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-signal">
              <FaLinkedin size={20} />
            </a>
            <a href={emailCompose} target="_blank" rel="noopener noreferrer" aria-label="Email" className="transition-colors hover:text-signal">
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        <div className="space-y-4 lg:border-l lg:border-hair lg:pl-10">
          <div>
            <p className="stamp mb-1">Status</p>
            <span className="status-pill">
              <span className="h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
              Available for work
            </span>
          </div>
          <div>
            <p className="stamp mb-1">Location</p>
            <p className="text-ink">{info.location}</p>
          </div>
          <div>
            <p className="stamp mb-1">Phone</p>
            <p className="font-mono text-sm text-ink">{info.phone}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
