'use client';

import { useEffect, useState } from 'react';

/**
 * Cycles through words with a type/delete effect + blinking caret.
 * Reduced-motion users see the first word, static (no caret animation).
 */
export default function Typewriter({
  words,
  className = '',
  caretClassName = '',
}: {
  words: string[];
  className?: string;
  caretClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(words[0]);
      return;
    }
    const current = words[index % words.length];
    let delay = deleting ? 45 : 85;
    if (!deleting && text === current) delay = 1500;
    else if (deleting && text === '') delay = 350;

    const t = setTimeout(() => {
      if (!deleting && text === current) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(current.substring(0, deleting ? text.length - 1 : text.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduced]);

  return (
    <span className={className} aria-label={words.join(', ')}>
      {text}
      {!reduced && (
        <span className={`ml-0.5 inline-block w-[0.6ch] animate-blink ${caretClassName}`}>▍</span>
      )}
    </span>
  );
}
