# E-Commerce Marketplace

A complete production-ready E-Commerce website built with Next.js 15, Prisma, and an Oracle-compatible backend structure.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Oracle Database (Schema provided via SQL script)
- **Authentication**: NextAuth
- **Storage**: Google Drive API for images

## Project Architecture (Clean Architecture)
- `src/app`: Next.js App Router pages and API routes
- `src/components`: UI components (Shadcn/UI & custom)
- `src/lib`: Utility functions and third-party configs (e.g., Google Drive)
- `src/actions`: Server actions for form handling
- `src/services`: Business logic layer
- `src/repositories`: Data access layer (Prisma queries)
- `src/hooks`: Custom React hooks
- `src/types`: TypeScript interfaces and type definitions

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Since Prisma does not have official native support for Oracle, use the provided `oracle_schema.sql` to initialize your Oracle Database tables. Alternatively, use a supported Prisma provider like PostgreSQL for testing by modifying `prisma/schema.prisma`.

3. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your credentials.
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment Guide (Vercel)

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project from your repository.
3. In the Vercel dashboard, add all the environment variables from your `.env` file.
4. Set the build command to `npm run build` and output directory to `.next`.
5. Deploy.

## GitHub Actions Workflow (CI/CD)
To automate linting and building on push, add a workflow to `.github/workflows/main.yml`.

```yaml
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm run lint
    - run: npm run build
```
