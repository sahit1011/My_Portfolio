'use client';

import { FaArrowRight } from 'react-icons/fa';
import Reveal from '../Reveal';
import MagneticButton from '../MagneticButton';

export default function ResumeMatchBand() {
  return (
    <section className="shell scroll-mt-20 border-t border-hair py-16 sm:py-20">
      <Reveal className="relative overflow-hidden rounded-2xl border border-hair bg-surface p-8 sm:p-12">
        <div className="ambient-glow right-[-8%] top-[-30%] h-[24rem] w-[24rem] opacity-[0.12]" aria-hidden />
        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="stamp mb-4 text-signal">Built with this site</p>
            <h2 className="max-w-[18ch] text-h2 font-semibold text-ink">
              Hiring? See how I fit your role.
            </h2>
            <p className="mt-4 max-w-prose text-lg text-muted">
              Paste a job description and an AI model scores my profile against your
              requirements — matched skills, gaps, and an overall fit read. It&apos;s a
              small demo of the kind of applied-AI tooling I build.
            </p>
            <div className="mt-8">
              <MagneticButton href="/resume-match" variant="solid">
                Try AI Resume Match <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
            </div>
          </div>

          {/* compact instrument-y preview */}
          <div className="hidden rounded-xl border border-hair bg-base/60 p-5 font-mono text-xs lg:block">
            <div className="mb-3 flex items-center justify-between text-faint">
              <span>fit_analysis.json</span>
              <span className="h-2 w-2 rounded-full bg-signal" />
            </div>
            <div className="space-y-2 text-muted">
              <div className="flex justify-between"><span>overall_match</span><span className="text-signal">87%</span></div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                <div className="h-full w-[87%] rounded-full bg-signal" />
              </div>
              <div className="flex justify-between"><span>matched_skills</span><span className="text-ink">14</span></div>
              <div className="flex justify-between"><span>gaps</span><span className="text-warn">2</span></div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
