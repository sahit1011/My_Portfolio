/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── "Baseline" v2 — instrument palette ─────────────────────
        // Near-black 4-step luminance ladder (cards lift via lightness,
        // not shadow). Two semantic accent channels only.
        base: '#070809',       // page background
        surface: '#0E1012',    // cards / panels
        elevated: '#15181B',   // raised / hover
        panel: '#1C2024',      // nested instrument housing (gauge)
        hair: 'rgba(255,255,255,0.07)',         // hairline border
        'hair-strong': 'rgba(255,255,255,0.12)', // hover hairline
        ink: '#F2F5F6',        // primary text (off-white, never pure)
        muted: '#98A0A6',      // secondary text / units / ticks
        faint: '#646C72',      // tertiary
        signal: {              // the single restrained accent
          DEFAULT: '#7FE0C2',
          dim: '#5BBBA0',
          light: '#A6ECD7',
        },
        warn: '#FFB454',       // amber — warning/calibration channel ONLY

        // ── Legacy tokens (kept so not-yet-rebuilt pages still compile;
        //    accent repointed to phosphor so they harmonize) ─────────
        accent: { DEFAULT: '#7FE0C2', dark: '#5BBBA0', light: '#A6ECD7' },
        primary: { DEFAULT: '#7FE0C2', dark: '#5BBBA0', light: '#A6ECD7' },
        secondary: { DEFAULT: '#7FE0C2', dark: '#5BBBA0', light: '#A6ECD7' },
        term: {
          bg: '#070809', surface: '#0E1012', elevated: '#15181B',
          border: 'rgba(255,255,255,0.07)', text: '#F2F5F6', muted: '#98A0A6',
          green: '#7FE0C2', amber: '#FFB454', blue: '#7FE0C2',
        },
        light: '#ffffff',
        'light-dark': '#0E1012',
        'light-darker': 'rgba(255,255,255,0.12)',
        dark: '#070809',
        'dark-light': '#0E1012',
        'dark-lighter': 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid display scale (letter-spacing baked per step).
        hero: ['clamp(2.5rem, 6.5vw, 5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h3: ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        readout: ['0.75rem', { lineHeight: '1', letterSpacing: '0.08em' }],
      },
      letterSpacing: {
        readout: '0.08em',
      },
      maxWidth: {
        prose: '68ch',
        page: '76rem',
      },
      transitionTimingFunction: {
        instrument: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'amber-pulse': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'amber-pulse': 'amber-pulse 1.1s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
