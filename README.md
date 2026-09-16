# Billflow

Billflow is an invoice and payment management application built with Next.js. It provides role-based authentication, multi-project client management, PDF upload with parsing, and currency conversion to USD for standardized reporting.

## What It Solves

- Manages clients and their associated projects.
- Allows uploading invoices and receipts as PDFs.
- Converts amounts to USD for normalized reporting.
- Links payments to outstanding invoices.
- Sends email notifications for client onboarding, invoice uploads, and payment registration.

## Features

### Authentication

- Login and session management via Supabase Auth.
- Password reset and initial password setup via recovery links.
- Role-based access with `admin` and `client` roles.
- Route protection middleware.

### Clients & Projects

- Create clients with automatic Supabase Auth user creation.
- Initial password setup emails via React Email + Nodemailer.
- CRUD for projects per client.
- Folder structure per project in Supabase Storage bucket `documents`.

### Invoices

- PDF upload to Supabase Storage.
- Basic parsing of invoice number, amount, and currency from PDFs.
- Stores exchange rate and USD-equivalent amount.
- Dashboard view with filters and derived states (`unpaid`, `pending`, `paid`).
- Bulk download of unpaid invoices as ZIP.

### Payments

- PDF receipt upload with basic parsing.
- Payment status tracking (`pending`, `approved`, `rejected`).
- Payment application to outstanding invoices via the `payment_invoices` junction table.
- Email notification on payment registration.

### Metrics

- Module and route exist but are currently in early development (placeholder).

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, styled-components, Tailwind CSS 4 |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| State | Zustand |
| Email | React Email, Nodemailer |
| PDF | unpdf |
| Archives | JSZip |
| Charts | Recharts |
| i18n | next-intl |

## Requirements

- Node.js 18+
- [pnpm](https://pnpm.io/) package manager
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required by Supabase migrations)
- A [Supabase](https://supabase.com/) account
- A Gmail account with an App Password (for sending real emails)

## Installation & Local Development

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Generate the icon map:**

   ```bash
   pnpm icons
   ```

3. **Create the environment file:**

   ```bash
   cp .env.example .env.local
   ```

4. **Fill in `.env.local`** (see Environment Variables below).

5. **Link and apply Supabase migrations:**

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

6. **Start the development server:**

   ```bash
   pnpm dev
   ```

7. **Open** [`http://localhost:3000`](http://localhost:3000).

## Environment Variables

### Public

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### Private

```env
SUPABASE_SECRET_KEY=...
GMAIL_USER=your-account@gmail.com
GMAIL_APP_PASSWORD=your-app-password
PERSONAL_EMAIL=your-email@domain.com
```

> **Note:** `.env.example` references `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but the codebase expects `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Make sure to define the latter in `.env.local` for the app to start without errors.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm icons` | Generate `src/components/icons/icons.ts` from `public/icons/*.svg` |
| `pnpm email:dev` | Local preview of email templates |
| `pnpm db:types` | Generate TypeScript types from Supabase schema |

## Database & Migrations

Migrations live in `supabase/migrations/`.

- Initial schema snapshot under `public/`.
- Auth user trigger in a separate migration.
- `documents` bucket definition and storage policies in a separate migration.

For schema changes:

1. Write changes as SQL (use the Supabase SQL Editor, not the Table Editor).
2. Generate the migration:

   ```bash
   supabase db diff -f <migration_name> --schema public
   ```

3. Review the generated SQL.
4. Commit.
5. Apply with `supabase db push`.

More details in `guides/database_guide.md` and `internal_guides/database_internal.md`.

## Data Model (High-Level)

### Tables

- `profiles`
- `clients`
- `projects`
- `invoices`
- `payments`
- `payment_invoices` (junction table linking payments to invoices)

### Views

- `invoice_summary`
- `client_stats`
- `project_stats`

## Project Structure

| Directory | Purpose |
| --- | --- |
| `src/app/` | Next.js App Router routes and layouts |
| `src/actions/` | Global server actions |
| `src/lib/` | Integrations (Supabase, notifications, env, utilities) |
| `src/stores/` | Zustand global state |
| `src/components/` | Reusable UI components |
| `src/types/` | TypeScript type definitions |
| `supabase/` | Supabase config and migrations |

## Quick Troubleshooting

| Problem | Solution |
| --- | --- |
| `Missing environment variable` | Check `.env.local` and verify variable names match exactly. |
| Emails not arriving | Validate `GMAIL_USER` and `GMAIL_APP_PASSWORD` (ensure it's a real App Password, not your account password). |
| `supabase db push` fails | Verify Docker is running and the correct Supabase project is linked. |
| Login redirects in a loop | Check Supabase session state and verify `NEXT_PUBLIC_SUPABASE_*` variables. |

## Project Status

- **Billing & Payments:** Functional
- **Client Invitation & Password Setup:** Functional
- **Metrics:** In progress
