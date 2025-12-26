# web-app

## 3.0.0

### Major Changes

- Migrated from vanilla HTML/JS to Next.js 15 with App Router
- Replaced imperative DOM manipulation with React components
- Migrated from runtime CSS injection to Tailwind CSS
- Removed dependency on `@monorepo/web-ui` (functionality recreated with Tailwind)
- Maintained dependency on `@monorepo/hello-world` for countdown functionality
- Preserved all original UI design and Chinese text
- Upgraded to React 19 and TypeScript strict mode

### Migration Notes

- Development server: `pnpm dev` (instead of `npx serve .`)
- Build command: `pnpm build`
- Production server: `pnpm start`
- New tech stack: Next.js 15 + React 19 + TypeScript + Tailwind CSS

## 2.0.0

### Major Changes

- test

### Patch Changes

- Updated dependencies
  - @monorepo/hello-world@2.0.0
