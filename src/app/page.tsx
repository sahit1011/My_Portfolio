'use client';

import { MotionConfig } from 'framer-motion';
import SiteNav from '@/components/baseline/SiteNav';
import SiteFooter from '@/components/baseline/SiteFooter';
import Hero from '@/components/baseline/sections/Hero';
import SkillsBand from '@/components/baseline/sections/SkillsBand';
import SelectedWork from '@/components/baseline/sections/SelectedWork';
import ExperienceTimeline from '@/components/baseline/sections/ExperienceTimeline';
import AboutSkills from '@/components/baseline/sections/AboutSkills';
import ResumeMatchBand from '@/components/baseline/sections/ResumeMatchBand';
import ContactSection from '@/components/baseline/sections/ContactSection';

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteNav home />
      <main>
        <Hero />
        <SkillsBand />
        <SelectedWork />
        <ExperienceTimeline />
        <AboutSkills />
        <ResumeMatchBand />
        <ContactSection />
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}
