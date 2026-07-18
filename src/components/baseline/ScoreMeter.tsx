'use client';

import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

/** Overall-fit readout: a count-up number + a calibrated bar that fills to value. */
export default function ScoreMeter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const target = Math.max(0, Math.min(100, Math.round(value)));

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [target]);

  const tone =
    target >= 80 ? 'text-signal' : target >= 60 ? 'text-warn' : 'text-red-400';
  const barTone =
    target >= 80 ? 'bg-signal' : target >= 60 ? 'bg-warn' : 'bg-red-400';

  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="stamp">Overall fit</p>
        <p className={`font-mono text-4xl font-semibold tabular-nums ${tone}`}>
          {display}
          <span className="text-xl text-muted">%</span>
        </p>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-instrument ${barTone}`}
          style={{ width: `${display}%` }}
        />
      </div>
      {/* tick marks */}
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-faint">
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
