/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#DBE1FE',
          200: '#BCC5FD',
          300: '#93A3FB',
          400: '#6B7DF7',
          500: '#3563E9',
          600: '#2B50C7',
          700: '#2340A5',
          800: '#1B3283',
          900: '#132461',
          950: '#0C1740',
        },
        surface: {
          50: '#FAFBFC',
          100: '#F6F7F9',
          200: '#ECEEF2',
          300: '#D5D8E0',
          400: '#A0A5B2',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        dark: {
          bg: '#0F1117',
          surface: '#1A1D26',
          card: '#222533',
          border: '#2E3244',
          hover: '#2A2D3A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '12px',
        'input': '12px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.25)',
        'card-dark-hover': '0 8px 40px rgba(0, 0, 0, 0.35)',
        'btn': '0 2px 8px rgba(53, 99, 233, 0.25)',
        'btn-hover': '0 4px 16px rgba(53, 99, 233, 0.35)',
        'input': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(53, 99, 233, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
