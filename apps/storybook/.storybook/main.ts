import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@monorepo/web-ui/styles.css': path.resolve(__dirname, '../../../packages/web-ui/src/styles.css'),
          '@monorepo/web-ui': path.resolve(__dirname, '../../../packages/web-ui/src/index.tsx'),
        },
      },
    });
  },
};
export default config;
