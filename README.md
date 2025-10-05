# Empower Orphans Website

A modern, production-ready Next.js 15 website for Empower Orphans - a student-led nonprofit supporting orphaned and vulnerable children.

## 🚀 Features

- **Modern Design System**: Beautiful UI with gradients, glassmorphism, shadows, and smooth animations
- **Framer Motion Animations**: GPU-accelerated animations for smooth performance
- **Supabase Integration**: Secure server-side queries for events and hero images
- **Responsive**: Mobile-first design that looks great on all devices
- **Type-Safe**: Built with TypeScript for reliability
- **SEO Optimized**: Meta tags and semantic HTML for better search rankings
- **Performance First**: Optimized images and assets for fast loading

## 🎨 Color Palette

- Primary Teal: `#0e869d`
- Light Background: `#c6f1f8`
- Accent Blue: `#79d3ff`
- Secondary Accent: `#45bfd6`
- Dark Text: `#0f5360`

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Deployment**: Vercel (recommended)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd efinal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🗂️ Project Structure

```
efinal/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── donate/            # Donate page (placeholder)
│   ├── events/            # Events page (dynamic from Supabase)
│   ├── programs/          # Programs page (placeholder)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── HeroCarousel.tsx   # Hero slider
│   ├── About.tsx          # About section
│   ├── DonationProgress.tsx
│   ├── Contact.tsx
│   ├── ChaptersJoin.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Utilities and configs
│   ├── supabase.ts        # Supabase client
│   └── config.ts          # Site configuration
└── public/                # Static assets

```

## 🔒 Security

**⚠️ IMPORTANT: Read [SECURITY.md](./SECURITY.md) for comprehensive security documentation.**

### Quick Summary:
- ✅ **Row Level Security (RLS)**: Database-level authorization on all tables
- ✅ **Server Action Protection**: Authorization + rate limiting on all CRUD operations
- ✅ **Path Traversal Prevention**: Sanitized file uploads with whitelist validation
- ✅ **Rate Limiting**: 30 writes, 100 reads, 10 uploads per 10 minutes
- ✅ **Restricted Image Loading**: Only `*.supabase.co` domains allowed
- ✅ **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- ✅ **Audit Logging**: Optional immutable audit trail for compliance
- ✅ **Login Rate Limiting**: 5 attempts per IP per 10 minutes
- ✅ **Session Management**: JWT tokens with automatic refresh
- ✅ **Input Validation**: Client-side and server-side validation

### Critical Files:
- `migrations/001_security_rls_policies.sql` - Database security policies
- `lib/rate-limit.ts` - Server action rate limiting
- `middleware.ts` - Route protection
- `app/admin/actions/*.ts` - Protected server actions

## 🌐 Pages

- **Home (/)**: Hero carousel, about, donations, contact, join chapters
- **About (/about)**: Team information and mission
- **Events (/events)**: Dynamic events from Supabase
- **Donate (/donate)**: Placeholder for future Stripe integration
- **Programs (/programs)**: Placeholder for program details
- **Admin (/admin)**: Protected admin area for content management

---

## 🔐 Admin Area

A production-ready admin dashboard for managing carousel images and events. Features include authentication, rate limiting, drag-and-drop uploads, and full CRUD operations.

### Features

#### Authentication & Security
- **Login Protection**: Email/password authentication via Supabase Auth with rate limiting
- **Multi-Layer Authorization**: Middleware + server actions + RLS policies
- **Route Protection**: Middleware guards all `/admin/*` routes
- **Role-Based Access**: Only users in the `admins` table can access the dashboard
- **Security Through Ambiguity**: Non-admin users receive 404 (not 403) for stealth
- **Server Action Rate Limiting**: Prevents abuse of CRUD operations (30/100/10 per 10min)
- **Strong RLS**: Database-level security policies enforce admin-only writes
- **File Upload Security**: Path traversal prevention and extension whitelist
- **Audit Trail**: Optional immutable logging of all admin actions
- **🔒 See [SECURITY.md](./SECURITY.md) for complete security documentation**

#### Carousel Manager
- **Drag-and-Drop Upload**: Upload images with native HTML5 drag-and-drop
- **File Validation**: Images only, 5MB max size
- **Visual Reordering**: Drag items to reorder, save with one click
- **Storage Integration**: Uses Supabase Storage (`media/carousel/`)
- **Automatic Cleanup**: Deleting an image removes both DB record and storage file

#### Events Manager
- **Full CRUD**: Create, Read, Update, Delete events
- **Rich Form**: Title, date/time picker, location, description, link, chapter, image upload
- **Search & Filter**: Real-time search across title, description, location
- **Image Management**: Upload new images on create/edit; old images auto-deleted on replacement
- **Validation**: Client-side and server-side validation with helpful error messages
- **Optimistic UI**: Smooth loading states and toast notifications

#### UI/UX
- **Brand Consistency**: Matches site's color palette (EO teal, sky, blue)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: ARIA labels, keyboard navigation, focus management, screen reader support
- **Toast Notifications**: Success/error messages with auto-dismiss
- **Confirmation Modals**: Prevents accidental deletions
- **Code Splitting**: Lazy-loaded panels keep public bundle lean

### Database Schema

The admin area uses the following tables:

#### `public.admins`
Source of truth for admin access.
```sql
CREATE TABLE public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### `public.login_attempts`
Rate limiting for login attempts.
```sql
CREATE TABLE public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

#### `public.carousel`
Stores carousel image metadata and ordering.
```sql
CREATE TABLE public.carousel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  sort_index integer NOT NULL DEFAULT 0,
  alt_text text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
```

#### `public.events`
Enhanced events table with admin tracking.
```sql
-- Columns added to existing events table:
event_date timestamptz NOT NULL,
link text,
created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
updated_at timestamptz DEFAULT now() NOT NULL
```

### Storage Buckets

#### `media` bucket
Public bucket for carousel and event images.

**Structure:**
```
media/
├── carousel/
│   └── {timestamp}-{random}.{ext}
└── events/
    └── {timestamp}-{random}.{ext}
```

**Policies:**
- **SELECT**: Public (anon + authenticated)
- **INSERT/UPDATE/DELETE**: Admins only

### Setup Instructions

⚠️ **SECURITY CRITICAL:** Follow these steps carefully to ensure proper security configuration.

#### 1. Run Database Migrations

Execute the SQL migration to create tables, RLS policies, storage policies, and rate limiting:

```bash
# Using Supabase CLI
supabase db push --file migrations/001_security_rls_policies.sql

# Or via Supabase Dashboard SQL Editor
# Copy and paste the contents of migrations/001_security_rls_policies.sql
```

#### 2. Create Your First Admin

After creating a user account in Supabase Auth, add them to the `admins` table:

```sql
-- Get the user_id from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Insert into admins table
INSERT INTO public.admins (user_id, email, created_by)
VALUES (
  'USER_UUID_FROM_ABOVE',
  'your-email@example.com',
  NULL  -- NULL for first admin, or another admin's user_id
);
```

**Via Supabase Dashboard:**
1. Go to Authentication → Users
2. Create a new user or copy existing user's UUID
3. Go to Table Editor → `admins` table
4. Insert new row with the user_id and email

#### 3. Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Never expose the service role key to the client.**

#### 4. Install Required Dependencies

The admin area requires the `@supabase/ssr` package for server-side auth:

```bash
npm install @supabase/ssr
```

#### 5. Verify Security Setup

**Run these queries in Supabase SQL Editor to verify RLS is working:**

```sql
-- 1. Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All tables should show 't' (true)

-- 2. Test as non-admin (should fail)
SET ROLE TO anon;
INSERT INTO public.events (title, date) VALUES ('Test', now());
-- Should get: "new row violates row-level security policy"
RESET ROLE;
```

#### 6. Deploy

When deploying to Vercel/production:

1. ✅ Set environment variables in your hosting platform
2. ✅ Run migrations on production database
3. ✅ Verify RLS policies are active (see step 5)
4. ✅ Create admin users in production
5. ✅ Test login and rate limiting
6. ✅ Test non-admin user access (should get 404)
7. ✅ Review [SECURITY.md](./SECURITY.md) checklist

### Usage Guide

#### Logging In

1. Navigate to `/admin/login`
2. Enter your email and password
3. Submit (rate limited to 5 attempts per 10 minutes)
4. On success, redirects to `/admin`

#### Managing Carousel Images

1. Go to Admin → Carousel tab
2. **Upload**: Drag images onto the drop zone or click to browse
3. **Reorder**: Drag images up/down to change order
4. Click "Save Order" to persist changes
5. **Delete**: Click "Delete" button, confirm in modal

#### Managing Events

1. Go to Admin → Events tab
2. **Create**: Click "Add Event", fill form, submit
3. **Edit**: Click "Edit" on any event, modify fields, submit
4. **Delete**: Click "Delete", confirm in modal
5. **Search**: Use search bar to filter events by title, description, or location

#### Logging Out

Click "Sign Out" in the top-right user menu.

### Security Considerations

**📖 Full documentation:** [SECURITY.md](./SECURITY.md)

1. **Multi-Layer Defense**: Middleware + server actions + RLS policies + rate limiting
2. **Admin Invitations**: Only existing admins can invite new admins (via RLS policy)
3. **Rate Limiting**: IP-based (login) + user-based (server actions) with SHA-256 hashing
4. **Server Actions**: All operations have authorization checks and rate limits
5. **Storage Policies**: Enforce admin-only writes; public reads for served images
6. **Path Traversal Prevention**: Sanitized file uploads with extension whitelist
7. **Image Loading Restrictions**: Only `*.supabase.co` domains allowed
8. **404 for Non-Admins**: Security through ambiguity prevents discovery
9. **Audit Trail**: Optional immutable logging for compliance
10. **Excluded from SEO**: `robots.txt` disallows `/admin/*`

**🚨 Security Checklist:** See [SECURITY.md](./SECURITY.md#-security-checklist-for-deployment)

### Troubleshooting

#### "Unauthorized" error
- Verify user exists in `public.admins` table
- Check RLS policies are enabled and correct
- Ensure environment variables are set

#### Rate limit issues
- Wait 10 minutes between login attempts
- Check `auth_flow.login_attempts` table for stuck records
- Run cleanup function: `SELECT auth_flow.cleanup_old_login_attempts();`

#### Images not uploading
- Verify `media` storage bucket exists and is public
- Check storage policies allow admin writes
- Ensure file size < 5MB and is an image type

#### Events not saving
- Check `events` table has all required columns
- Verify RLS policies on `events` table
- Check browser console and server logs for errors

### Development

#### File Structure

```
app/admin/
├── login/
│   ├── page.tsx           # Login form
│   └── actions.ts         # Login/logout server actions
├── actions/
│   ├── carousel.ts        # Carousel CRUD server actions
│   └── events.ts          # Events CRUD server actions
├── page.tsx               # Admin route guard
├── AdminDashboard.tsx     # Main dashboard shell
├── CarouselPanel.tsx      # Carousel management UI
└── EventsPanel.tsx        # Events management UI

components/admin/
├── Toast.tsx              # Toast notification system
├── Modal.tsx              # Modal and ConfirmModal components
└── Tabs.tsx               # Tab navigation component

lib/
├── supabase-server.ts     # Server-side Supabase client
└── supabase-client.ts     # Client-side Supabase client

middleware.ts              # Route protection middleware
```

#### Adding New Admin Features

To add a new admin panel:

1. Create server actions in `app/admin/actions/{feature}.ts`
2. Create panel component `app/admin/{Feature}Panel.tsx`
3. Lazy load in `AdminDashboard.tsx`
4. Add tab to tabs array
5. Create DB tables/RLS policies in a new migration

### Performance

- **Bundle Size**: Admin code split from public bundle via `dynamic()` imports
- **Lazy Loading**: Panels only load when their tab is active
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Image Optimization**: Next.js automatic image optimization for uploaded images
- **Caching**: Server components cache until revalidation

---

## 📝 License

Copyright © 2025 Empower Orphans. All rights reserved.

