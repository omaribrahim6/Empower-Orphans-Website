-- =====================================================
-- Security Migration: Row Level Security Policies
-- =====================================================
-- This migration adds comprehensive RLS policies to protect
-- all admin-related tables from unauthorized access.

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ADMINS TABLE POLICIES
-- =====================================================

-- Admin users can read the admins table (to verify their own status)
CREATE POLICY "Authenticated users can read admins table"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Only existing admins can insert new admins
CREATE POLICY "Only admins can create new admins"
ON public.admins
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- Admins cannot delete themselves or others (prevents lockout)
CREATE POLICY "Admins cannot delete admin records"
ON public.admins
FOR DELETE
TO authenticated
USING (false);

-- No updates allowed (use delete + insert to change admins)
CREATE POLICY "Admins cannot update admin records"
ON public.admins
FOR UPDATE
TO authenticated
USING (false);

-- =====================================================
-- LOGIN ATTEMPTS TABLE POLICIES
-- =====================================================

-- Server actions can insert login attempts (anonymous access for rate limiting)
CREATE POLICY "Anyone can insert login attempts"
ON public.login_attempts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view login attempts (for admin monitoring)
CREATE POLICY "Authenticated users can read login attempts"
ON public.login_attempts
FOR SELECT
TO authenticated
USING (true);

-- Server actions can delete old login attempts (cleanup)
CREATE POLICY "Anyone can delete old login attempts"
ON public.login_attempts
FOR DELETE
TO anon, authenticated
USING (created_at < (now() - interval '10 minutes'));

-- =====================================================
-- EVENTS TABLE POLICIES
-- =====================================================

-- Public read access to events (for the events page)
CREATE POLICY "Anyone can read events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can create events
CREATE POLICY "Only admins can create events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update events
CREATE POLICY "Only admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- Only admins can delete events
CREATE POLICY "Only admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- HERO_SLIDES TABLE POLICIES
-- =====================================================

-- Public read access to hero slides (for the homepage carousel)
CREATE POLICY "Anyone can read hero slides"
ON public.hero_slides
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can create hero slides
CREATE POLICY "Only admins can create hero slides"
ON public.hero_slides
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update hero slides (for reordering)
CREATE POLICY "Only admins can update hero slides"
ON public.hero_slides
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- Only admins can delete hero slides
CREATE POLICY "Only admins can delete hero slides"
ON public.hero_slides
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- STORAGE POLICIES (for 'media' bucket)
-- =====================================================

-- Public read access to media bucket
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'media',
  'Public read access to media files',
  'bucket_id = ''media''',
  'SELECT'
);

-- Only admins can upload to media bucket
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'media',
  'Only admins can upload to media',
  '(bucket_id = ''media'') AND (EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  ))',
  'INSERT'
);

-- Only admins can update media files
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'media',
  'Only admins can update media',
  '(bucket_id = ''media'') AND (EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  ))',
  'UPDATE'
);

-- Only admins can delete media files
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
  'media',
  'Only admins can delete media',
  '(bucket_id = ''media'') AND (EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  ))',
  'DELETE'
);

-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================

-- Create a helper function for easier admin checks
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.user_id = $1
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- =====================================================
-- RATE LIMIT LOG TABLE
-- =====================================================

-- Create rate limit log table for server action rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- user_id or IP hash
  action text NOT NULL, -- 'read', 'write', 'upload'
  ip_hash text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on rate limit log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Anyone can insert rate limit logs (for tracking)
CREATE POLICY "Anyone can insert rate limit logs"
ON public.rate_limit_log
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can read rate limit logs (for rate limit checking)
CREATE POLICY "Anyone can read rate limit logs"
ON public.rate_limit_log
FOR SELECT
TO anon, authenticated
USING (true);

-- Anyone can delete old rate limit logs (cleanup)
CREATE POLICY "Anyone can delete old rate limit logs"
ON public.rate_limit_log
FOR DELETE
TO anon, authenticated
USING (created_at < (now() - interval '10 minutes'));

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_identifier ON public.rate_limit_log(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_created_at ON public.rate_limit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_action ON public.rate_limit_log(action);

-- =====================================================
-- AUDIT LOG TABLE (Optional but recommended)
-- =====================================================

-- Create audit log table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit log
CREATE POLICY "Only admins can read audit log"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  )
);

-- System can insert audit logs (using service role in server actions)
CREATE POLICY "System can insert audit logs"
ON public.admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- No one can update or delete audit logs (immutable)
CREATE POLICY "Audit logs are immutable"
ON public.admin_audit_log
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Audit logs cannot be deleted"
ON public.admin_audit_log
FOR DELETE
TO authenticated
USING (false);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id ON public.admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_table_name ON public.admin_audit_log(table_name);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.admins TO authenticated;
GRANT SELECT ON public.events TO anon, authenticated;
GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT SELECT ON public.admin_audit_log TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these queries to verify RLS is working:

-- 1. Check that RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 2. List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies WHERE schemaname = 'public';

-- 3. Test as non-admin (should fail):
-- SET ROLE TO anon;
-- INSERT INTO public.events (title, date) VALUES ('Test', now());
-- RESET ROLE;

