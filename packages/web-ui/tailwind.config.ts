import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'web-ui': {
          bg: '#09090b',
          ink: {
            DEFAULT: '#fafafa',
            muted: '#a1a1aa',
          },
          accent: {
            DEFAULT: '#f97316',
            strong: '#ea580c',
          },
          surface: '#18181b',
          border: '#27272a',
        },
      },
      boxShadow: {
        'web-ui': '0 6px 18px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'web-ui': '12px',
        'web-ui-card': '18px',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
