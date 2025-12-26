import type { Config } from 'tailwindcss'
import webUiConfig from '../../packages/web-ui/tailwind.config'

const config: Config = {
  presets: [webUiConfig],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config