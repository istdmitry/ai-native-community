import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--skin-primary)',
          hover: 'var(--skin-primary-hover)',
          light: 'var(--skin-primary-light)',
          lighter: 'var(--skin-primary-lighter)',
        },
        secondary: {
          DEFAULT: 'var(--skin-secondary)',
          hover: 'var(--skin-secondary-hover)',
          light: 'var(--skin-secondary-light)',
        },
        surface: {
          main: 'var(--skin-bg-main)',
          alt: 'var(--skin-bg-alt)',
          card: 'var(--skin-bg-surface)',
        },
      },
      textColor: {
        main: 'var(--skin-text-main)',
        'sub': 'var(--skin-text-secondary)',
        muted: 'var(--skin-text-muted)',
        light: 'var(--skin-text-light)',
      },
      borderColor: {
        skin: 'var(--skin-border)',
        'skin-light': 'var(--skin-border-light)',
        'skin-focus': 'var(--skin-border-focus)',
      },
      borderRadius: {
        card: 'var(--skin-radius-card)',
        btn: 'var(--skin-radius-button)',
        input: 'var(--skin-radius-input)',
      },
      boxShadow: {
        card: 'var(--skin-shadow-card)',
        btn: 'var(--skin-shadow-button)',
        glass: 'var(--skin-glass-glow)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        glass: 'var(--skin-glass-blur)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
