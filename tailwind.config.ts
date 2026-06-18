import type { Config } from 'tailwindcss';

/**
 * AECS Design System — Tailwind token mapping.
 * Palette governed by brand-guid logo/icon/homepage rules:
 *   Engineering Charcoal (#1F2328) · Architectural Ivory (#ECE9E3) · Architectural Gold (#B89A63)
 * Gold appears ONLY at transformation / decision points (never as base structure).
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
        // Engineering layer (primary)
        ink: {
          DEFAULT: '#1F2328',
          950: '#0F1113',
          900: '#16191D',
          800: '#1A1D21',
          700: '#2A2F36',
          600: '#3B424C',
          500: '#555D68',
          400: '#7A8491',
          300: '#AAB2BD',
          200: '#D4DAE2',
          100: '#EEF1F5',
        },
        // Architectural layer (surface / neutrals)
        ivory: '#ECE9E3',
        surface: '#F5F3EF',
        // Authority accent — transformation point only
        gold: {
          DEFAULT: '#B89A63',
          900: '#3A2A12',
          800: '#5A421A',
          700: '#7A5A22',
          600: '#9A7A38',
          500: '#B89A63',
          400: '#CBB07E',
          300: '#DCC79B',
          200: '#EBDCBC',
          100: '#F7EFD9',
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
        display: ['var(--font-display)', 'var(--font-vazir)', 'sans-serif'],
      },
      fontSize: {
        // type scale (clamped) — structural, not decorative
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
        sm: '0 2px 6px rgba(15,17,19,0.06)',
        md: '0 6px 18px rgba(15,17,19,0.10)',
        lg: '0 12px 32px rgba(15,17,19,0.14)',
        xl: '0 24px 64px rgba(15,17,19,0.20)',
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
          'linear-gradient(to right, rgba(122,132,145,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(122,132,145,0.08) 1px, transparent 1px)',
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
