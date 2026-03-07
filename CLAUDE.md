# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cuenti is a multi-tenant financial SaaS application for small businesses to manage sales, expenses, clients, and services. Built with Next.js 16 (App Router), PostgreSQL via Prisma, and Auth0 authentication.

## Commands

```bash
npm run dev              # Start development server (port 3000)
npm run build            # Build for production
npm run lint             # Run ESLint
npm run setup:minio      # Initialize MinIO storage buckets

npx prisma migrate dev   # Create and apply migrations
npx prisma studio        # View/edit database in browser
npx prisma generate      # Regenerate Prisma client (after schema changes)
```

Docker workflow:
```bash
docker-compose up        # Full stack (app + PostgreSQL + MinIO)
```

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
  - `(dashboard)/` - Protected dashboard pages (group routing)
  - `api/` - REST API endpoints (12 resource routes)
  - `auth/` - Auth0 callback handling
- `src/components/` - React components organized by feature (clients, sales, services, expenses, dashboard)
- `src/service/` - Business logic services (AnalyticsService, SaleService, ExpenseService, etc.)
- `src/hooks/` - Data fetching hooks (useSales, useExpenses, useClients, etc.)
- `src/lib/` - Utilities, types, Prisma client, Auth0 config, cache
- `src/generated/prisma/` - Prisma-generated client (auto-generated, do not edit)
- `prisma/` - Database schema and migrations

### Service Layer Pattern
Business logic is encapsulated in `src/service/`. Each service handles one domain:
- Services depend on Prisma client passed via constructor
- Used by both API routes and server components
- Example: `SaleService.create()`, `ExpenseService.getByCompany()`

### Multi-tenancy
All data is scoped to Company. Users own companies, and all resources (services, clients, sales, expenses) belong to a company via `companyId` foreign key.

### Database
PostgreSQL with Prisma ORM. Schema at `prisma/schema.prisma`. Key models:
- User (Auth0 integration, onboarding state)
- Company (tenant isolation)
- Service, Client, Sale, Expense, Category

Financial fields use `Decimal(10,2)` for precision. Composite indexes on `[companyId, date]` for query performance.

### Authentication Flow
Auth0 handles authentication. Custom callback in `src/lib/auth0.ts` creates user on first login and enforces onboarding. Session managed via `Auth0Provider` at root layout.

### File Storage
MinIO (S3-compatible) for profile pictures. Upload endpoint at `/api/upload`. Bucket: `profile-pictures`.

### Caching
Simple in-memory TTL cache in `src/lib/cache.ts` (1 minute default). Used for API response caching.

## Environment Variables

Required:
```
DATABASE_URL           # PostgreSQL connection string
AUTH0_DOMAIN           # Auth0 tenant domain
AUTH0_CLIENT_ID        # Auth0 app client ID
AUTH0_CLIENT_SECRET    # Auth0 app client secret
AUTH0_SECRET           # Session encryption key
AUTH0_BASE_URL         # App URL for callbacks
APP_BASE_URL           # Frontend URL
MINIO_ENDPOINT         # MinIO endpoint
MINIO_ACCESS_KEY       # MinIO access key
MINIO_SECRET_KEY       # MinIO secret key
PROFILE_BUCKET         # Storage bucket name
```

## Tech Stack

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4, Lucide React (icons), Recharts (charts)
- Prisma 6 with PostgreSQL adapter
- Auth0 for authentication
- MinIO for file storage
- Zod for validation
