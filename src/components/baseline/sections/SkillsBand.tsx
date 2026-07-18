'use client';

import SkillsMarquee from '../SkillsMarquee';

/** Full-bleed "moving train" of the stack, sits right under the hero. */
export default function SkillsBand() {
  return (
    <section className="border-y border-hair bg-surface/30 py-8">
      <p className="shell stamp mb-6">Tech I work with</p>
      <SkillsMarquee />
    </section>
  );
}
