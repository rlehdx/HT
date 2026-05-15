import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        soft: 'var(--color-soft)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        'text-main': 'var(--color-text-main)',
        'text-sub': 'var(--color-text-sub)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
}
export default config
