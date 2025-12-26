# Migration Guide: v0.1.0 -> v1.0.0

The `v1.0.0` release is a complete rewrite of `@monorepo/web-ui` as a React component library. It is **not backward compatible** with `v0.1.0`.

## Key Changes

- **Technology**: Vanilla JS DOM Factories -> React Functional Components
- **Styling**: Runtime injected CSS string -> Tailwind CSS (via CSS file import)
- **API**: Functions (`createButton`) -> Components (`<Button />`)

## Setup Changes

### 1. Stylesheet

You must now import the CSS file in your application root (e.g., `layout.tsx` or `App.tsx`):

```tsx
import '@monorepo/web-ui/styles.css';
```

### 2. Tailwind Config (Optional)

If you want to use the design tokens in your own app, add the preset to your `tailwind.config.ts`:

```ts
import webUiConfig from '@monorepo/web-ui/tailwind.config';

export default {
  // ...
  presets: [webUiConfig],
};
```

## Component Migration

### Button

**v0.1.0**:
```js
import { createButton } from '@monorepo/web-ui';

const btn = createButton({
  label: 'Click me',
  variant: 'primary',
  onClick: () => console.log('clicked')
});
document.body.appendChild(btn);
```

**v1.0.0**:
```tsx
import { Button } from '@monorepo/web-ui';

function App() {
  return (
    <Button variant="primary" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  );
}
```

### Input

**v0.1.0**:
```js
import { createInput } from '@monorepo/web-ui';

const input = createInput({
  placeholder: 'Type here...',
  value: 'Initial'
});
```

**v1.0.0**:
```tsx
import { Input } from '@monorepo/web-ui';

function App() {
  return <Input placeholder="Type here..." defaultValue="Initial" />;
}
```

### Card

**v0.1.0**:
```js
import { createCard } from '@monorepo/web-ui';

const card = createCard({
  title: 'Title',
  body: 'Content'
});
```

**v1.0.0**:
```tsx
import { Card, CardHeader, CardTitle, CardBody } from '@monorepo/web-ui';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardBody>
        Content
      </CardBody>
    </Card>
  );
}
```
