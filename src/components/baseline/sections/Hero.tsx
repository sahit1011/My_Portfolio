'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import MagneticButton from '../MagneticButton';
import Typewriter from '../Typewriter';
import HeroBackdrop from '../hero/HeroBackdrop';
import HeroShipCard from '../hero/HeroShipCard';
import { EASE_OUT } from '../motion';
import { getPersonalInfo, getGithubUrl, getLinkedinUrl, getEmailComposeUrl } from '@/utils/content';

const ROLES = ['a Software Engineer', 'an AI Engineer', 'an ML Engineer', 'a Data Scientist'];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE_OUT, delay },
});

export default function Hero() {
  const info = getPersonalInfo();
  const emailCompose = getEmailComposeUrl();

  // Scroll parallax: the neural field lags behind while the text scrolls up
  // faster, so the two move at different rates (depth). Off for reduced-motion.
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-38%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6, 1], reduced ? [1, 1, 1] : [1, 1, 0.35]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[68vh] items-center overflow-hidden pb-10 pt-28 sm:pt-32"
    >
      {/* neural-field backdrop — extends beyond the hero so the parallax drift
          never reveals empty edges. Subtler on mobile so text stays readable. */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 -top-[20%] z-0 h-[140%] opacity-60 lg:opacity-100"
      >
        <HeroBackdrop />
      </motion.div>
      {/* legibility masks over the field so the text stays readable */}
      <div
        className="absolute inset-0 z-[1] hidden lg:block bg-gradient-to-r from-base via-base/75 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent to-base"
        aria-hidden
      />

      {/* ambient glow */}
      <div className="ambient-glow left-[-10%] top-[6%] h-[36rem] w-[36rem]" aria-hidden />
      <div className="ambient-glow right-[-5%] bottom-[0%] h-[28rem] w-[28rem] opacity-10" aria-hidden />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="shell relative z-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
        <div className="relative z-10">
        <motion.p {...fadeUp(0)} className="stamp mb-10 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-amber-pulse rounded-full bg-signal" />
            Available for work
          </span>
          <span className="text-faint">/</span>
          <span>Software&nbsp;Engineer&nbsp;·&nbsp;AI/ML</span>
          <span className="text-faint">/</span>
          <span>{info.location}</span>
        </motion.p>

        <motion.p
          {...fadeUp(0.05)}
          className="mb-2 font-mono text-lg text-muted sm:text-xl"
        >
          <span className="text-signal">Hola</span> <span className="wave-emoji">👋</span>, myself
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className="max-w-[15ch] text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
        >
          {info.displayName}
        </motion.h1>

        <motion.p
          {...fadeUp(0.13)}
          className="mt-1.5 font-mono text-sm text-faint"
          title="24 — one byte (8-bit) in memory"
        >
          <span className="text-signal">0001&nbsp;1000</span> yrs old
        </motion.p>

        <motion.div
          {...fadeUp(0.16)}
          className="mt-4 flex items-center gap-2 font-mono text-lg text-muted sm:text-xl"
        >
          <span className="text-faint">{'> '}I&apos;m</span>
          <Typewriter words={ROLES} className="font-medium text-signal" caretClassName="text-signal" />
        </motion.div>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 max-w-prose text-balance text-xl leading-relaxed text-muted sm:text-2xl"
        >
          I build <span className="text-ink">real-world AI/ML systems</span> and the
          full-stack products around them — from models in production to the
          interfaces people actually use.
        </motion.p>

        <motion.div {...fadeUp(0.24)} className="mt-10 flex flex-wrap items-center gap-3">
          <MagneticButton href="#work" variant="solid">
            View work <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            Get in touch
          </MagneticButton>
        </motion.div>

        <motion.div {...fadeUp(0.32)} className="mt-10 flex items-center gap-6 text-muted">
          <a href={getGithubUrl()} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-signal">
            <FaGithub size={20} />
          </a>
          <a href={getLinkedinUrl()} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-signal">
            <FaLinkedin size={20} />
          </a>
          <a href={emailCompose} target="_blank" rel="noopener noreferrer" aria-label="Email" className="transition-colors hover:text-signal">
            <FaEnvelope size={20} />
          </a>
          <span className="hidden h-px w-12 bg-hair sm:block" />
          <span className="hidden font-mono text-xs text-faint sm:block">scroll to explore ↓</span>
        </motion.div>
        </div>

        {/* right column — latest ship, playing its demo loop over the field */}
        <div className="relative hidden lg:flex lg:translate-y-4 lg:justify-end lg:self-end">
          <HeroShipCard />
        </div>
        </div>
      </motion.div>
    </section>
  );
}
