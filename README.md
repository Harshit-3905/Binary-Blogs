# Binary Blogs

A modern React + TypeScript blogging platform powered by Appwrite.

## Features

- Email/password auth + guest login
- Blog listing/detail/create/edit flows
- Likes, bookmarks, and comments
- User preferences and dashboard analytics
- Markdown rendering with Prism syntax highlighting
- Route-level code splitting with protected/guest-only routes

## Tech stack

- React 18 + TypeScript
- Vite
- Zustand (state management)
- React Router
- Tailwind CSS + shadcn/ui + Radix UI
- Appwrite (auth, database, storage)

## Project structure

- `src/services/real/*`: Appwrite-backed services (single source of truth)
- `src/services/index.ts`: service barrel exports
- `src/lib/appwrite.ts`: Appwrite client instances
- `src/lib/appwriteConfig.ts`: Appwrite IDs and constants
- `src/store/*`: Zustand stores
- `src/pages/*`: route pages

## Prerequisites

- Node.js 20+
- npm
- Appwrite project with database/collections/bucket already provisioned

## Environment variables

Copy `.env.example` to `.env` and set:

```env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint/v1
VITE_APPWRITE_DATABASE_ID=your_database_id
```

Collection and bucket IDs are constants in `src/lib/appwriteConfig.ts`:

- Collections: `users`, `blogs`, `comments`, `likes`, `bookmarks`, `preferences`, `tags`
- Bucket: `blog_images`

## Install and run

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```

## Guest login

Guest login uses a fixed account configured in `src/services/real/authService.ts`.
If you want different guest credentials, update the guest constants there.

## Deployment

GitHub Actions workflow: `.github/workflows/deploy-to-aws.yml`

Build step expects these GitHub secrets:

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`

AWS deploy/invalidation secrets are also required by the workflow.
