# Application Architecture

## Technology Stack & Decisions

### 1. Frontend Framework: Remix

- **Why Remix?**
  - Server-side rendering (SSR) out of the box
  - Built-in routing and data loading
  - TypeScript support
  - Excellent developer experience
  - Progressive enhancement
  - Built-in error boundaries

### 2. Database & Authentication: Supabase

- **Why Supabase?**
  - Free tier with generous limits
  - PostgreSQL database
  - Built-in authentication
  - Real-time capabilities
  - Row Level Security (RLS)
  - Easy to set up and maintain
  - REST and GraphQL APIs

#### Supabase Setup Guide

1. **Create Supabase Project**

   ```bash
   # Visit https://supabase.com
   # Click "New Project"
   # Fill in project details:
   - Name: your-project-name
   - Database Password: generate a strong password
   - Region: choose closest to your users
   - Pricing Plan: Free tier
   ```

2. **Database Schema Setup**

   ```sql
   -- Users Table
   create table public.users (
     id uuid references auth.users primary key,
     username text unique not null,
     email text unique,
     is_guest boolean default false,
     points integer default 0,
     achievements jsonb default '[]'::jsonb,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Enable Row Level Security
   alter table public.users enable row level security;

   -- Policies
   create policy "Users can read own data"
     on public.users for select
     using (auth.uid() = id);

   create policy "Users can update own data"
     on public.users for update
     using (auth.uid() = id);
   ```

3. **Authentication Setup**

   - Navigate to Authentication → Settings
   - Configure Site URL: `http://localhost:3000` (development)
   - Enable Email auth provider
   - Configure email templates (optional)

4. **API Keys & Environment Variables**
   - Go to Project Settings → API
   - Copy Project URL and anon/public key
   - Create `.env` file:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Session Management

#### Session Secret Generation

1. **Development Environment**

   ```bash
   # Generate a secure random string using Node.js
   node -e "console.log(crypto.randomBytes(32).toString('hex'))"

   # Add to .env file
   SESSION_SECRET=generated_secret_here
   ```

2. **Production Environment (Vercel)**
   - Generate a different secret for production
   - Add to Vercel environment variables:
     1. Go to Vercel Dashboard → Project
     2. Settings → Environment Variables
     3. Add `SESSION_SECRET`

#### Session Configuration

1. typescript

```typescript
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
```
