# Tracklio

Tracklio is a private job search workspace for tracking applications from saved role to signed offer. It helps keep roles, follow-ups, notes, employment records, and attachments in one focused dashboard.

## Features

- Dashboard overview for saved roles, applications, interviews, offers, follow-up coverage, and pipeline health.
- Application tracking with company, role, location, job URL, salary range, status, applied date, follow-up date, and notes.
- Employer records for accepted offers, including department, manager details, start/end dates, salary, and employment type.
- Detail pages with collapsible application/employer summaries.
- Notes and file attachments for each application.
- Supabase authentication and protected routes.
- Account settings for password updates.
- Responsive layouts for desktop and mobile.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Motion for page and dialog transitions

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file with your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-service-role-or-secret-key
```

`SUPABASE_SECRET_KEY` is only used server-side for account deletion. Do not expose it in browser code.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Supabase Data

Tracklio expects tables for:

- `job_applications`
- `employers`
- `job_notes`
- `job_attachments`

Attachments are stored in Supabase Storage and referenced from `job_attachments`.

## Project Structure

- `app/components` - shared UI, landing page, auth page, sidebar, motion helpers
- `app/(auth)` - sign in and sign up routes
- `app/(protected)` - authenticated dashboard, applications, employers, and settings
- `app/api` - route handlers for applications, employers, notes, attachments, and account actions
- `supabase` - Supabase client, server, middleware, and admin helpers

## Deployment

Build the app before deploying:

```bash
npm run build
```

Set the same Supabase environment variables in your hosting provider.
