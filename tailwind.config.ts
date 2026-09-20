import type { Config } from 'tailwindcss';

/**
 * AECS Design System — Tailwind token mapping (LIGHT industrial theme,
 * gold accent). Ground truth: /brand-guid/website-ux/10-Color_System_AECS.css.
 *   Base #FBF8F3 (warm ivory) · Panel rgba(26,20,13,0.035) · Hairline rgba(26,20,13,0.10)
 *   Gold #C8A24A · Text #1B160F · Text-muted rgba(27,22,15,0.6)
 *
 * `ink` is a proper foreground/text scale — dark, regardless of theme,
 * because ink is dark pigment. Page/panel backgrounds use the dedicated
 * `surface` / `ivory` / `panel` tokens instead of the ink scale, so a single
 * token never has to mean both "dark text" and "dark background".
 *
 * A handful of sections are a deliberate dark "engineering" contrast band
 * (the `dark` prop on <Section>, the closing RFQ CTA, the full-bleed photo
 * hero) — those keep the charcoal ink-950/900 as a literal background and
 * are intentionally left untouched by the light theme.
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    // 12-column AECS grid · 1440 max · 80px desktop margin
    container: {
      center: true,
      padding: {
        DEFAULT: '20px',
        md: '40px',
        lg: '80px',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px',
    },
    extend: {
      colors: {
        // Foreground / text scale — always dark ("ink"), a few of these
        // values also back the deliberate dark contrast bands (see header).
        ink: {
          DEFAULT: '#1B160F', // primary text / solid marks
          950: '#1B160F', // darkest ink — also the dark-band page base
          900: '#2B2318', // dark-band lifted panel
          800: '#3C3121',
          700: '#4C4230', // strong body text
          600: '#5E5240',
          500: '#7A6D59', // labels · eyebrows · captions
          400: '#8A7E6E', // muted / auxiliary text
          300: '#4C4230', // secondary body copy (kept as dark as 700 — heavy use, needs contrast)
          200: '#E7E0D2', // hairline border · grid divider (light)
          100: '#EDE6D8', // lightest placeholder surface
        },
        // Alt surfaces
        ivory: '#F1EAE0', // secondary light surface
        surface: '#FBF8F3', // page background
        base: '#FBF8F3', // explicit page base alias
        panel: 'rgba(27,22,15,0.035)', // glass surface (dark tint on light)
        hair: 'rgba(27,22,15,0.10)', // hairline (dark tint on light)
        // Authority accent — transformation point only
        gold: {
          DEFAULT: '#C8A24A',
          950: '#211806',
          900: '#3A2A12',
          800: '#5A421A',
          700: '#876427',
          600: '#A98438',
          500: '#C8A24A',
          400: '#D8B86E',
          300: '#E5CB93',
          200: '#EFDDB8',
          100: '#F8EFD9',
        },
        // Functional system colors
        success: '#2A8A74',
        warning: '#C89A3A',
        danger: '#B23A3A',
        info: '#3A6EA8',
      },
      fontFamily: {
        sans: ['var(--font-vazir)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        latin: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Editorial serif for display headings (matches design references)
        display: ['var(--font-display)', 'var(--font-vazir)', 'Georgia', 'serif'],
      },
      fontSize: {
        // type scale (clamped) — structural, not decorative.
        // Sub-caption label tokens replace previously-arbitrary text-[…rem]
        // sizes on small uppercase labels, tags, nav items and control text.
        // Each usage still sets its own tracking; these only fix the size step.
        micro: ['0.625rem', { lineHeight: '1.2' }], // tags / format badges (was 0.6–0.65rem)
        label: ['0.6875rem', { lineHeight: '1.2' }], // buttons / control labels (was 0.7–0.72rem)
        'label-lg': ['0.8125rem', { lineHeight: '1.25' }], // nav / mobile actions (was 0.78–0.82rem)
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'body-s': ['0.875rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-l': ['1.125rem', { lineHeight: '1.6' }],
        h4: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        h2: ['clamp(1.75rem, 1rem + 2.4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        h1: ['clamp(2.25rem, 1rem + 4vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      spacing: {
        // 8px baseline system
        section: '4.5rem',
        'section-lg': '6rem',
      },
      maxWidth: {
        grid: '1440px',
        prose: '68ch',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 2px 6px rgba(27,22,15,0.08)',
        md: '0 8px 24px rgba(27,22,15,0.10)',
        lg: '0 18px 48px rgba(27,22,15,0.14)',
        xl: '0 28px 80px rgba(27,22,15,0.18)',
        gold: '0 10px 30px rgba(200,162,74,0.25)',
      },
      transitionDuration: {
        fast: '180ms',
        DEFAULT: '300ms',
        medium: '450ms',
        slow: '700ms',
      },
      transitionTimingFunction: {
        aecs: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      backgroundImage: {
        // dark hairline grid — for light surfaces (the default)
        'grid-lines':
          'linear-gradient(to right, rgba(27,22,15,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,22,15,0.06) 1px, transparent 1px)',
        // light hairline grid — for the deliberate dark contrast bands
        'grid-lines-dark':
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'line-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'reveal-up': 'reveal-up 0.55s cubic-bezier(0.22,0.61,0.36,1) both',
        'line-grow': 'line-grow 0.7s cubic-bezier(0.22,0.61,0.36,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
