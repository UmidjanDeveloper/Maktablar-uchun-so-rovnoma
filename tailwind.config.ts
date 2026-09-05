import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        /**
         * Brend ranglari Xatirchi tumani gerbidan olingan:
         * daryo (ko'k), quyosh (sariq), tog'lar va nihol (yashil).
         */
        brand: {
          50: '#EAF2FB',
          100: '#CFE1F5',
          200: '#A6C7EA',
          300: '#6FA3D8',
          400: '#3F7FC2',
          500: '#2266AC',
          600: '#17559B',
          700: '#124580',
          800: '#0F3E75',
          900: '#0B2E58',
        },
        sun: {
          50: '#FEF7E7',
          100: '#FDECC3',
          200: '#FBDC92',
          300: '#F7C64D',
          400: '#F2B01E',
          500: '#D89506',
          600: '#B67B05',
          700: '#8C5E0A',
        },
        leaf: {
          50: '#EAF6EC',
          100: '#CDEAD3',
          200: '#9DD4A8',
          300: '#5FB871',
          400: '#2E9B3F',
          500: '#1F7A2D',
          600: '#186224',
        },
        ink: {
          DEFAULT: '#0E2439',
          soft: '#3D556B',
          faint: '#7189A0',
        },
        cream: {
          DEFAULT: '#FBF8F1',
          deep: '#F4EFE3',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14,36,57,0.04), 0 8px 24px -8px rgba(14,36,57,0.10)',
        'soft-lg': '0 2px 4px rgba(14,36,57,0.05), 0 18px 44px -12px rgba(14,36,57,0.18)',
        lift: '0 10px 30px -10px rgba(14,36,57,0.28)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sun-rise': {
          '0%':   { transform: 'translateY(14px) scale(0.94)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(0.9)', opacity: '0.55' },
          '70%':  { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.35s ease-out both',
        'sun-rise': 'sun-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
