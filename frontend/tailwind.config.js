/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.333' }],
        sm: ['0.875rem', { lineHeight: '1.429' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      colors: {
        primary: {
          DEFAULT: '#6CA6CD',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#B2A5FF',
          foreground: '#ffffff',
        },
        background: {
          DEFAULT: '#F8FAFF',
          dark: '#0F1419',
        },
        foreground: {
          DEFAULT: '#1A1A1A',
          dark: '#E5E7EB',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1A1F2E',
          foreground: {
            DEFAULT: '#1A1A1A',
            dark: '#E5E7EB',
          },
        },
        muted: {
          DEFAULT: '#C3CEDA',
          dark: '#374151',
          foreground: {
            DEFAULT: '#5A5A5A',
            dark: '#9CA3AF',
          },
        },
        border: {
          DEFAULT: 'rgba(108, 166, 205, 0.15)',
          dark: 'rgba(108, 166, 205, 0.2)',
        },
        input: 'transparent',
        ring: '#6CA6CD',
      },
    },
  },
  plugins: [],
}

