'use client';

import { useEffect, useRef } from 'react';
import ProjectPreview from './ProjectPreview';

/**
 * Project card cover. If a `video` is provided it plays a muted, looping preview
 * — but only while scrolled into view (IntersectionObserver), so off-screen
 * carousel cards don't burn CPU/network. The `preview` image is the poster, so
 * it shows instantly and remains if the video is missing or still loading.
 */
export default function CardCover({
  video,
  preview,
  title,
  label,
  index,
}: {
  video?: string;
  preview?: string;
  title: string;
  label?: string;
  index?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (!video) {
    return <ProjectPreview src={preview} alt={title} label={label} index={index} className="h-full w-full" />;
  }

  return (
    <video
      ref={ref}
      src={video}
      poster={preview}
      muted
      loop
      playsInline
      preload="none"
      aria-label={title}
      className="h-full w-full bg-base object-cover"
    />
  );
}
