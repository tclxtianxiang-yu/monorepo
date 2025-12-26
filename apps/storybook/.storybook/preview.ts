import type { Preview } from '@storybook/react';
import '@monorepo/web-ui/styles.css';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'web-ui',
      values: [
        {
          name: 'web-ui',
          value: '#f8f5ef',
        },
        {
          name: 'white',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#222222',
        },
      ],
    },
  },
};

export default preview;
