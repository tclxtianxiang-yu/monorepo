# web-app

A Next.js application for user registration with phone verification.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI**: Custom components with design tokens
- **Utilities**: @monorepo/hello-world (countdown timer)

## Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm dev

# Or from monorepo root
cd apps/web-app
pnpm dev
```

Development server runs on http://localhost:3000

## Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Features

- User registration form with phone number input
- SMS verification code input
- 60-second countdown timer for code resend
- Responsive design with radial gradient background
- Chinese language UI (用户注册)

## Architecture

- **Server Components**: Root layout, home page
- **Client Components**: Registration form (for interactivity)
- **Workspace Packages**: Uses @monorepo/hello-world for countdown functionality
- **Styling**: Tailwind CSS with custom design tokens extracted from original web-ui package
