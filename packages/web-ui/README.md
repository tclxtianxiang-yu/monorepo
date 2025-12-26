# @monorepo/web-ui

Modern React UI components built with Radix UI and Tailwind CSS.

## Installation

```bash
pnpm add @monorepo/web-ui
```

## Setup

1. Import the stylesheet in your root layout:

```tsx
import '@monorepo/web-ui/styles.css';
```

2. (Optional) Extend Tailwind config:

```ts
// tailwind.config.ts
import webUiConfig from '@monorepo/web-ui/tailwind.config';

export default {
  presets: [webUiConfig],
  // ...
};
```

## Components

### Button

```tsx
import { Button } from '@monorepo/web-ui';

<Button variant="primary">Click me</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
```

### Input

```tsx
import { Input } from '@monorepo/web-ui';

<Input placeholder="Enter email..." type="email" />
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@monorepo/web-ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardBody>
    Main content goes here.
  </CardBody>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

## Development

- `pnpm build`: Build the package
- `pnpm lint`: Type check
- `turbo run storybook`: Run Storybook documentation
