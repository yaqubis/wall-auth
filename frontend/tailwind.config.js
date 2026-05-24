/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        junto: {
          50:  '#F9F7F3',
          100: '#F2EDE4',
          200: '#E5DDD0',
          300: '#C8BAA8',
          400: '#A89280',
          500: '#8B7260',
        },
        sage: {
          50:  '#EFF4F1',
          100: '#D8E8DD',
          200: '#B0D1BB',
          300: '#7EB597',
          400: '#5B9B7A',
          500: '#4A7C5F',
          600: '#3A6049',
          700: '#2D4A38',
        },
        terra: {
          400: '#D4855A',
          500: '#C06840',
          600: '#A85530',
        },
        ink: '#1C1C1A',
      },
      backgroundImage: {
        'junto-warm':     'linear-gradient(135deg, #F2EDE4 0%, #EFF4F1 100%)',
        'sage-gradient':  'linear-gradient(135deg, #4A7C5F 0%, #5B9B7A 100%)',
        'terra-gradient': 'linear-gradient(135deg, #C06840 0%, #D4855A 100%)',
        'panel-fade':     'linear-gradient(180deg, transparent 35%, rgba(28,28,26,0.75) 100%)',
      },
      boxShadow: {
        'card':        '0 2px 16px rgba(28,28,26,0.08)',
        'card-hover':  '0 8px 32px rgba(28,28,26,0.12)',
        'button':      '0 4px 16px rgba(192,104,64,0.25)',
        'sage-button': '0 4px 16px rgba(74,124,95,0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in':  'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.35s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
