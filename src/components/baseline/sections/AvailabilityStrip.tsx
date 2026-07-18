'use client';

const ITEMS = [
  'Open to work',
  'Full-time & Freelance',
  'AI / ML Engineering',
  'Full-stack Product',
  'Hyderabad · Remote-friendly',
];

// One wide copy, duplicated for a seamless -50% loop.
const COPY = [...ITEMS, ...ITEMS, ...ITEMS];

export default function AvailabilityStrip() {
  return (
    <section className="marquee overflow-hidden border-y border-hair bg-surface/40 py-4">
      <div className="marquee-track" style={{ ['--marquee-dur' as string]: '36s' }}>
        {[...COPY, ...COPY].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center font-mono text-sm uppercase tracking-[0.18em] text-muted"
          >
            <span className="mx-6">{item}</span>
            <span className="text-signal">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
