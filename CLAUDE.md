# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a pnpm + Turborepo monorepo with the following workspace organization:

- `packages/*` - Shared libraries published to a local Verdaccio registry
  - `@monorepo/hello-world` - Utility functions (countdown timer, console output)
  - `@monorepo/web-ui` - DOM-based UI components (Button, Input, Card) with embedded styles

- `apps/*` - Applications consuming workspace packages
  - `web-app` - Static HTML demo app using `@monorepo/hello-world` and `@monorepo/web-ui`

## Commands

### Build, Test, Lint
```bash
# Build all packages (runs across workspace with dependency ordering)
pnpm build

# Run tests across all packages
pnpm test

# Run linting across all packages
pnpm lint
```

### Package Development
```bash
# Build a specific package
cd packages/hello-world
pnpm build

# Build output goes to dist/ directory
# TypeScript compiles src/ → dist/ using tsconfig.json
```

### Running the Demo App
```bash
cd apps/web-app
pnpm start  # Serves current directory with npx serve
```

The app imports built packages from `node_modules/@monorepo/*/dist/index.js` as ES modules.

## Version Management with Changesets

This repo uses `@changesets/cli` for versioning and publishing packages to a local Verdaccio registry (`http://localhost:4873`).

```bash
# Create a new changeset (describes what changed)
pnpm changeset

# Bump package versions based on changesets
pnpm version-packages

# Publish updated packages to Verdaccio
pnpm publish-packages
```

## TypeScript Configuration

All packages use ES2020 target with ESM modules. Key tsconfig settings:
- `strict: true` - Full TypeScript strictness enabled
- `declaration: true` - Generates .d.ts files
- `outDir: ./dist`, `rootDir: ./src`

## Architecture Notes

### Package Publishing Flow
1. Packages are scoped to `@monorepo/` namespace
2. `publishConfig.registry` points to local Verdaccio instance
3. Only `dist/` directory is published (see `files` in package.json)
4. Build must complete before publishing (`prepublishOnly` script)

### Web UI Design Pattern
The `@monorepo/web-ui` package injects styles once via `ensureStyles()` when any component is created. Styles use CSS custom properties for theming and are scoped with `.web-ui-*` class prefixes to avoid conflicts.

### App Dependencies
The `web-app` uses workspace protocol (`workspace:*`) to reference local packages. After building packages, the app imports the compiled JS directly from node_modules using native ES module imports in the browser.
