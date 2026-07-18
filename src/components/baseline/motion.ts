// Centralized motion tokens — every animation pulls from here so the whole
// site shares one calm, consistent motion language (not a pile of effects).

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const DUR = 0.55;
export const STAGGER = 0.07;

// Soft spring for hover/score transitions (no bouncy overshoot).
export const SOFT_SPRING = { type: 'spring', stiffness: 120, damping: 20 } as const;

// Standard section/card reveal.
export const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR, ease: EASE_OUT },
  },
};

export const revealStagger = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

// A small, deliberate vocabulary so sections don't all enter identically.
// Each reveal fits what it reveals — headings settle, timelines slide in.

// Section headings: a longer, weightier rise than body content.
export const revealHeading = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

// Editorial accent rule that draws in from the left, then the label.
export const revealRule = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

// Directional entrances for asymmetric layouts (timelines, side panels).
export const revealLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: DUR, ease: EASE_OUT } },
};

export const revealRight = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: DUR, ease: EASE_OUT } },
};

export const viewportOnce = { once: true, margin: '-80px' } as const;
