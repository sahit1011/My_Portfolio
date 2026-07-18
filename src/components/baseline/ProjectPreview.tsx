'use client';

import { useState } from 'react';

/**
 * Project cover image with a graceful, on-brand fallback tile.
 * Drop a PNG at `src` (e.g. /projects/<slug>.png) and it replaces the tile.
 */
export default function ProjectPreview({
  src,
  alt,
  label,
  index,
  className = '',
}: {
  src?: string;
  alt: string;
  label?: string;
  index?: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-elevated ${className}`}>
      {/* fallback tile (always behind the image) */}
      <div className="absolute inset-0 bg-gradient-to-br from-signal/12 via-surface to-base" />
      <div className="hero-grid absolute inset-0 opacity-25" aria-hidden />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {label && (
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{label}</span>
        )}
        {index && (
          <span className="self-end font-mono text-6xl font-bold leading-none text-white/[0.05]">{index}</span>
        )}
      </div>

      {src && ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
