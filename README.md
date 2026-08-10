# ALX Dashboard - Company Profile CMS

ALX Dashboard is a frontend CMS (Content Management System) dashboard prototype designed to manage a company profile website. It provides an intuitive interface for editing homepage sections, global site settings, navigation menus, footer content, blog posts, and user accounts.

**Note:** The current implementation uses in-memory/local mock data only. There are no API routes, database clients, authentication, upload storage, or persistence layers integrated yet. Existing save actions currently log to the browser console.

## Features

- **Global Settings Management:** Manage global site navigation, footer configurations, and general settings.
- **Homepage Section Editors:**
  - Hero Slides management (Add, edit, reorder)
  - Company Stats manager
  - Partners list management
  - Services Preview configuration
  - Testimonials management
  - SEO settings configuration
- **Posts & Users:** Dashboard scaffolding for blog posts and user management.
- **Interactive UI:** Drag-and-drop support for reordering content using `@dnd-kit`.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React](https://react.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) and Radix UI primitives
- **Icons:** [Lucide React](https://lucide.dev/)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)

## Getting Started

### Prerequisites

Make sure you have Node.js and `npm` installed.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the exact locked dependencies using npm:

```bash
npm ci
```

### Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the dashboard.

### Build and Production

Create the production build (includes TypeScript validation):

```bash
npm run build
```

Serve the completed production build:

```bash
npm run start
```

### Linting

Run ESLint across the repository to catch code issues:

```bash
npm run lint
```

## Project Structure

- `src/app/`: Next.js App Router routes, root layout, and global styles.
  - `global/`: Global settings, navigation, and footer editors.
  - `home/`: Homepage section editors (hero-slides, stats, partners, testimonials, etc.).
  - `posts/`, `settings/`, `users/`: Dashboard and placeholder pages.
- `src/components/`: Reusable React components.
  - `ui/`: Shared shadcn/Radix UI primitives.
  - `pages/home/`: Reusable homepage editor forms.
- `src/constants/`: Mock content and shared ambient types.
- `src/lib/`: Utility functions (e.g., `cn()` for Tailwind classes).

## State Management and Persistence

Currently, the application uses local client state and context (e.g., `SidebarProvider`). Since there is no backend configured, changes made in the dashboard (like reordering slides or editing stats) are not persisted across page reloads. Hooking up a real backend or API layer is required for full functionality.
