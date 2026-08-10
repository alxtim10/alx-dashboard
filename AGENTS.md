# ALX Dashboard Agent Guide

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing or changing Next.js code, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Summary

ALX Dashboard is a frontend CMS dashboard prototype. It manages homepage sections, global site settings, navigation, footer content, posts, and users. The current implementation uses in-memory/local mock data only: there are no API routes, database clients, authentication, upload storage, or persistence layer. Existing save actions log to the browser console.

## Tech Stack

- Node.js with npm. Use npm because `package-lock.json` is committed.
- Next.js 16.2.7 with React 19.2.4 and the App Router.
- TypeScript in strict mode; `@/*` resolves to `src/*`.
- Tailwind CSS with CSS variables in `src/app/globals.css` and `tailwind.config.js`.
- shadcn/ui (Radix Nova configuration), Radix UI primitives, and Lucide icons.
- `class-variance-authority`, `clsx`, and `tailwind-merge`; use `cn()` from `@/lib/utils` to compose Tailwind classes.
- `@dnd-kit` for sortable lists in the homepage, navigation, and footer editors.
- `next/image` for images. Remote images currently must match the Unsplash pattern configured in `next.config.ts`.

## Repository Layout

```text
src/
  app/                         App Router routes, root layout, and global styles
    global/                    Global settings, navigation, and footer editors
    home/                      Homepage-section editors
      hero-slides/              List, add, and dynamic edit routes
      stats/                    Stats manager, add, and dynamic edit routes
    posts/, settings/, users/   Dashboard and placeholder pages
  components/
    ui/                         Shared shadcn/Radix UI primitives
    pages/home/                 Reusable homepage editor forms
    sidebar.tsx                 Dashboard navigation
    sidebar-context.tsx         Client sidebar state provider
    topbar.tsx                  Shared page header
  constants/                    Mock content and shared ambient types
  lib/utils.ts                  `cn()` class-name utility
public/                         Static assets
```

Root configuration files:

- `next.config.ts`: Next configuration and allowed remote image hosts.
- `tsconfig.json`: strict TypeScript configuration and `@/*` alias.
- `eslint.config.mjs`: Next Core Web Vitals and TypeScript lint rules.
- `components.json`: shadcn/ui aliases and styling configuration.
- `tailwind.config.js`: Tailwind theme tokens and animation plugin.
- `postcss.config.mjs` and `postcss.config.js`: both exist; validate the build before changing either configuration.

## Coding Rules

- Keep route files under `src/app` and follow App Router conventions. Dynamic route `params` are asynchronous in this Next.js version; await them as existing edit routes do.
- Components are Server Components by default. Add `"use client"` only when using state, effects, event handlers, browser APIs, or client hooks such as `useRouter` and `usePathname`.
- Use absolute `@/` imports for source modules. Reuse `Button`, `Input`, `Textarea`, `Switch`, `Label`, `Separator`, and `Tooltip` from `@/components/ui` before creating another primitive.
- Preserve the shared dashboard shell in `src/app/layout.tsx`, `SidebarProvider`, `Sidebar`, and `Topbar`. Add corresponding sidebar navigation when introducing an implemented dashboard route.
- Use TypeScript types for component props and state. Keep feature-specific types close to the feature; avoid changing the ambient types in `src/constants/type.ts` without verifying all consumers.
- Style with Tailwind utility classes and semantic project tokens such as `bg-background`, `border-border`, `text-muted-foreground`, and `bg-primary`. Extend design tokens in Tailwind/global CSS instead of scattering repeated custom values.
- Compose conditional classes with `cn()`, not manual string concatenation, in new or modified reusable UI code.
- Use `next/link` for internal navigation and `next/image` for images. When adding a remote image host, update `next.config.ts` with the narrowest viable `remotePatterns` rule.
- Keep interactive editors responsive and accessible: use semantic controls, meaningful image `alt` text, visible focus styles, and existing mobile Tailwind breakpoints.
- Treat all current arrays in page files and `src/constants/index.ts` as mock data. Do not imply data is persisted. Introduce a real data boundary before wiring save, upload, delete, or reorder operations to production behavior.
- Preserve DnD Kit sensor, collision, and sortable-context patterns for reorderable content. Persist updated ordering only when a data layer exists.
- Do not edit generated or ignored artifacts: `node_modules/`, `.next/`, coverage, or `.env*`. Never add secrets to source control.

## Commands

```bash
# Install exact locked dependencies
npm ci

# Run the local development server (http://localhost:3000)
npm run dev

# Run ESLint across the repository
npm run lint

# Create the production build; includes TypeScript validation
npm run build

# Serve a completed production build
npm run start
```

There is no test framework, test script, or test files configured. Add test tooling and a corresponding npm script before claiming automated test coverage.

## Validation Status

- `npm run build` currently succeeds.
- `npm run lint` currently fails on pre-existing errors: synchronous `setState` calls in effects in several client editors, plus CommonJS `require()` usage in `tailwind.config.js`. It also reports unused-import/type warnings. Do not treat a lint failure as introduced by a change unless the changed files cause it; run lint and report the relevant result.
