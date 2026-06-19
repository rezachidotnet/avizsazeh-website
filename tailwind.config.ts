import type { Config } from 'tailwindcss';

/**
 * AECS Design System — Tailwind token mapping (DARK luxury industrial theme).
 * Ground truth: /design-system/*.png.
 *   Base #0B0F14 · Surface rgba(255,255,255,0.04) · Hairline rgba(255,255,255,0.08)
 *   Gold #C8A24A · Text #FFFFFF · Text-muted rgba(255,255,255,0.7)
 *
 * The `ink` scale is a DARK-THEME remap, assigned by usage rather than a single
 * monotonic ramp:
 *   100/200 .............. dark surfaces, hairline borders & grid dividers
 *   300/400/500/600/700 .. foreground text (lighter = more prominent)
 *   800/900/950 .......... lifted panels → page base
 * Gold remains reserved for transformation / decision points.
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
        // Neutral scale — assigned by usage (see header note)
        ink: {
          DEFAULT: '#FFFFFF', // primary text / solid marks
          950: '#0B0F14', // page base
          900: '#10151C', // lifted dark panel
          800: '#222B34', // strong divider
          700: '#C7CED8', // strong body text
          600: '#AEB6C1', // body / secondary text
          500: '#8A93A0', // labels · eyebrows · captions
          400: '#79828F', // muted / auxiliary text
          300: '#C7CED8', // bright secondary text (on imagery / dark)
          200: '#1B232C', // hairline border · grid divider
          100: '#12181F', // darkest surface (image placeholders)
        },
        // Alt surfaces
        ivory: '#0E141A', // subtle lifted surface (was light ivory)
        surface: '#0B0F14', // page background
        base: '#0B0F14', // explicit page base alias
        panel: 'rgba(255,255,255,0.04)', // glass surface (spec)
        hair: 'rgba(255,255,255,0.08)', // hairline (spec)
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
        section: '6rem',
        'section-lg': '8rem',
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
        sm: '0 2px 6px rgba(0,0,0,0.4)',
        md: '0 8px 24px rgba(0,0,0,0.45)',
        lg: '0 18px 48px rgba(0,0,0,0.55)',
        xl: '0 28px 80px rgba(0,0,0,0.6)',
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
        'grid-lines':
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
