'use client';

import Image from 'next/image';
import { FaGraduationCap, FaBriefcase, FaLayerGroup, FaCompass } from 'react-icons/fa';
import Reveal from '../Reveal';
import SectionHeader from './SectionHeader';
import ChatBio from '../ChatBio';
import SpotlightCard from '../SpotlightCard';
import CountUp from '../CountUp';
import { getAboutInfo } from '@/utils/content';

const CARD = 'rounded-xl border border-hair bg-surface p-6 transition-colors duration-300 hover:border-hair-strong';

export default function AboutSkills() {
  const about = getAboutInfo();
  const messages = about.chat ?? about.bio;

  return (
    <section id="about" className="scroll-mt-20 border-t border-hair py-16 sm:py-20">
      <div className="shell">
        <SectionHeader stamp="About" title="A bit about me" />

        {/* portrait + chat bio */}
        <div className="grid max-w-3xl grid-cols-1 items-stretch gap-6 lg:max-w-5xl lg:grid-cols-[24rem_1fr] lg:gap-14">
          <Reveal variant="left" className="order-2 lg:order-1 lg:self-center">
            <div className="relative mx-auto aspect-square w-full max-w-[24rem] overflow-hidden rounded-full border border-hair lg:mx-0">
              <Image
                src="/images/portrait-2026.png"
                alt="Anil Sahith"
                fill
                sizes="(max-width: 1024px) 24rem, 384px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/5" />
            </div>
          </Reveal>

          <Reveal variant="right" className="order-1 h-full lg:order-2">
            <ChatBio messages={messages} />
          </Reveal>
        </div>

        {/* enhanced cards */}
        <Reveal stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SpotlightCard tilt className={CARD}>
            <FaGraduationCap className="mb-4 text-2xl text-signal" />
            <p className="stamp mb-2">Education</p>
            <p className="text-lg font-medium text-ink">B.Tech, EEE</p>
            <p className="mt-1 text-sm text-muted">NIT Warangal</p>
          </SpotlightCard>

          <SpotlightCard tilt className={CARD}>
            <FaBriefcase className="mb-4 text-2xl text-signal" />
            <p className="stamp mb-2">Experience</p>
            <p className="font-mono text-3xl font-semibold tabular-nums text-ink">
              <CountUp to={2} suffix="+" />
              <span className="ml-1.5 text-base font-normal text-muted">yrs</span>
            </p>
          </SpotlightCard>

          <SpotlightCard tilt className={CARD}>
            <FaLayerGroup className="mb-4 text-2xl text-signal" />
            <p className="stamp mb-2">Technologies</p>
            <p className="font-mono text-3xl font-semibold tabular-nums text-ink">
              <CountUp to={20} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-muted">languages, frameworks &amp; tools</p>
          </SpotlightCard>

          <SpotlightCard tilt className={CARD}>
            <FaCompass className="mb-4 text-2xl text-signal" />
            <p className="stamp mb-3">Currently exploring</p>
            <div className="flex flex-wrap gap-2">
              {about.currentlyExploring.map((c) => (
                <span key={c} className="rounded-md border border-hair px-2 py-1 font-mono text-xs text-muted">
                  {c}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
