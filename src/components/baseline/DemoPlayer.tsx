'use client';

import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import ProjectPreview from './ProjectPreview';

/**
 * Shows the project preview as a poster with a play button; on click, swaps to
 * the demo video with controls. If no `video`, it's just the preview.
 */
export default function DemoPlayer({
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
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-hair bg-base">
      {playing && video ? (
        <video src={video} controls autoPlay playsInline className="h-full w-full bg-base object-contain" />
      ) : (
        <button
          type="button"
          onClick={() => video && setPlaying(true)}
          className={`group block h-full w-full ${video ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={video ? 'Play demo' : title}
        >
          <ProjectPreview src={preview} alt={title} label={label} index={index} className="h-full w-full" />
          {video && (
            <>
              <span className="absolute inset-0 flex items-center justify-center bg-base/30 transition-colors group-hover:bg-base/15">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-signal text-base shadow-[0_8px_30px_-6px_rgba(127,224,194,0.6)] transition-transform duration-300 group-hover:scale-110">
                  <FaPlay className="ml-1" size={20} />
                </span>
              </span>
              <span className="absolute bottom-4 left-4 font-mono text-xs text-ink/80">▶ watch demo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
