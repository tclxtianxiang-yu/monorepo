# Repository Guidelines

## Project Structure & Module Organization
- Monorepo layout under `packages/`.
- `packages/hello-world/` is a TypeScript package with source in `src/`, compiled output in `dist/`, and config in `tsconfig.json`.
- `packages/web-app/` is a static web app with `index.html` at the root of the package.
- No dedicated `tests/` directory is present; add one per package if you introduce tests.

## Build, Test, and Development Commands
- `cd packages/hello-world && npm run build` — compiles TypeScript to `dist/` using `tsc`.
- `cd packages/hello-world && npm publish` — runs `prepublishOnly` which triggers the build (configured for local registry).
- `cd packages/web-app && npm run start` — serves the static site via `npx serve .`.
- There is no root-level task runner; run commands from each package.

## Coding Style & Naming Conventions
- Languages: TypeScript in `hello-world`, HTML in `web-app`.
- No formatter or linter config is present; follow existing file style and keep changes minimal.
- Use clear, descriptive names; keep exports in `hello-world` aligned with package name and `dist` entry points.

## Testing Guidelines
- No test framework or scripts are configured yet.
- If you add tests, keep them package-scoped (e.g., `packages/hello-world/tests/` or `packages/hello-world/src/**/*.test.ts`).
- Document any new test command in the package `package.json`.

## Commit & Pull Request Guidelines
- Git history is not available in this workspace, so commit conventions are unknown.
- Suggested default: short imperative subject (e.g., "Add hello-world export") and include scope when helpful.
- PRs should explain intent, list affected packages, and include screenshots for `web-app` UI changes.

## Security & Configuration Tips
- `hello-world` publishes to a local registry (`publishConfig.registry`), so confirm your registry before publishing.
- Avoid committing secrets or local registry credentials to the repo.
