import type { Config } from 'tailwindcss';
import webUiConfig from '../../packages/web-ui/tailwind.config';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/web-ui/src/**/*.{ts,tsx}',
  ],
  presets: [webUiConfig],
};

export default config;
