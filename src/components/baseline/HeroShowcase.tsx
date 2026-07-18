'use client';

import { useState } from 'react';
import HeroVisual from './HeroVisual';
import HeroConstellation from './HeroConstellation';
import HeroAsciiDonut from './HeroAsciiDonut';
import HeroOscilloscope from './HeroOscilloscope';
import HeroTelemetry from './HeroTelemetry';

// Temporary A/B harness — lets you click through every hero visual live, then
// pick one. Once decided, drop this and render the chosen component directly.
const VISUALS = [
  { id: 'orb', label: 'orb', Comp: HeroVisual },
  { id: 'field', label: 'field', Comp: HeroConstellation },
  { id: 'donut', label: 'donut', Comp: HeroAsciiDonut },
  { id: 'scope', label: 'scope', Comp: HeroOscilloscope },
  { id: 'telemetry', label: 'telemetry', Comp: HeroTelemetry },
] as const;

export default function HeroShowcase({ initial = 'field' }: { initial?: string }) {
  const [active, setActive] = useState(initial);
  const current = VISUALS.find((v) => v.id === active) ?? VISUALS[1];
  const Comp = current.Comp;

  return (
    <div className="relative h-full w-full">
      <Comp key={active} />

      {/* switcher (remove once a visual is chosen) */}
      <div className="pointer-events-auto absolute bottom-1 left-1/2 z-30 flex -translate-x-1/2 gap-0.5 rounded-full border border-hair bg-base/80 px-1.5 py-1 backdrop-blur">
        {VISUALS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActive(v.id)}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              active === v.id ? 'bg-signal/15 text-signal' : 'text-faint hover:text-muted'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
