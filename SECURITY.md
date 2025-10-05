# Security Documentation

## Overview

This document outlines the security measures implemented in the Empower Orphans website, with a focus on the admin area and data protection.

## 🔒 Security Measures Implemented

### 1. Row Level Security (RLS) Policies

All database tables have comprehensive RLS policies that enforce authorization at the database level, preventing unauthorized access even if someone has the anon key.

#### Protected Tables:
- `public.admins` - Only admins can create new admins; no one can delete admin records
- `public.events` - Public read, admin-only write/update/delete
- `public.hero_slides` - Public read, admin-only write/update/delete
- `public.login_attempts` - Rate limiting tracking
- `public.rate_limit_log` - Server action rate limiting
- `public.admin_audit_log` - Immutable audit trail (optional)

#### Storage Policies:
- `media` bucket - Public read, admin-only write/update/delete

**Why This Matters:**
Even if an attacker obtains your `NEXT_PUBLIC_SUPABASE_ANON_KEY` (which is visible in client-side code), they cannot directly manipulate data through Supabase's REST API because RLS policies check the authenticated user's admin status.

### 2. Server Action Protection

All server actions (`'use server'` functions) have multiple layers of protection:

#### Authorization Checks:
Every CRUD operation verifies:
1. User is authenticated
2. User exists in the `admins` table
3. User has valid session

#### Rate Limiting:
All server actions are rate-limited by action type:
- **Write Operations**: 30 requests per 10 minutes
- **Read Operations**: 100 requests per 10 minutes
- **Upload Operations**: 10 requests per 10 minutes

Rate limiting uses user ID (if authenticated) or hashed IP address to prevent abuse.

#### Affected Actions:
- `createEvent()` - Write + upload rate limits
- `updateEvent()` - Write + upload rate limits
- `deleteEvent()` - Write rate limits
- `getEvents()` - Read rate limits
- `uploadCarouselImage()` - Upload rate limits
- `deleteCarouselImage()` - Write rate limits
- `reorderCarouselImages()` - Write rate limits
- `getCarouselImages()` - Read rate limits

### 3. File Upload Security

#### Path Traversal Prevention:
- File extensions are sanitized using regex: `/[^a-z0-9]/g`
- Only lowercase alphanumeric characters allowed
- Extension validation against whitelist: `['jpg', 'jpeg', 'png', 'gif', 'webp']`

#### File Validation:
- MIME type check: Must start with `image/`
- Size limit: 25MB maximum
- Unique filename generation: `{timestamp}-{random}.{ext}`
- Stored in namespaced paths: `events/` or `carousel/`

**Example Attack Prevented:**
```
Malicious filename: "../../etc/passwd.jpg"
After sanitization: "etcpasswd.jpg" (safely stored)
```

### 4. Middleware Route Protection

The Next.js middleware (`middleware.ts`) protects all `/admin/*` routes:
- Redirects unauthenticated users to `/admin/login`
- Verifies Supabase auth session
- Excludes `/admin/login` from protection (allows login page access)

**Note:** Middleware protects page routes but not server actions directly. Server actions rely on internal authorization checks and RLS policies.

### 5. Authentication Security

#### Login Protection:
- Email/password authentication via Supabase Auth
- Rate limiting: 5 attempts per IP per 10 minutes
- Failed attempts are logged with hashed IP (SHA-256)
- Cleanup of old attempts (>10 minutes) on each login

#### Session Management:
- Supabase JWT tokens with HttpOnly cookies
- Automatic token refresh via middleware
- Session expiry handled by Supabase

#### Admin Role Verification:
- Double-check on page load: middleware + page component
- Triple-check on data operations: server action + RLS policy
- Security through ambiguity: non-admins receive 404 instead of 403

### 6. Image Hosting Restrictions

The `next.config.ts` restricts remote images to only Supabase domains:
```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '*.supabase.co',
  },
]
```

**Prevents:**
- SSRF (Server-Side Request Forgery) attacks
- Loading malicious images from untrusted sources
- Using the app as an image proxy

### 7. HTTP Security Headers

Comprehensive security headers in `next.config.ts`:
- `Strict-Transport-Security`: Enforces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Content-Security-Policy`: Restricts resource loading
- `Permissions-Policy`: Disables unnecessary browser features

### 8. Input Validation & Sanitization

#### Server-Side Validation:
- Required field checks (title, date, etc.)
- Type validation (File objects, strings, etc.)
- SQL injection prevention (Supabase parameterized queries)

#### Client-Side Validation:
- HTML5 form validation
- Real-time error feedback
- Type-safe TypeScript interfaces

## 🚨 Known Limitations

### Server Actions Exposure
While server actions have robust authorization and rate limiting, they are still accessible via POST requests to Next.js internal routes. This is mitigated by:
1. Authorization checks in every function
2. RLS policies at the database level
3. Rate limiting per user/IP
4. Audit logging (optional)

**Recommendation:** Monitor `rate_limit_log` and `admin_audit_log` tables for suspicious activity.

### Cookie-Based Authentication
Authentication relies on Supabase JWT cookies. While these are signed and verified:
- If the JWT secret is compromised, attackers could forge tokens
- RLS policies provide an additional defense layer even if cookies are compromised

**Recommendation:** 
- Keep `SUPABASE_JWT_SECRET` secure
- Regularly rotate secrets if compromise is suspected
- Monitor `admin_audit_log` for unauthorized actions

## 🔍 Security Checklist for Deployment

### Before Deploying to Production:

- [ ] Run the SQL migration: `migrations/001_security_rls_policies.sql`
- [ ] Verify RLS is enabled on all tables
- [ ] Create your first admin user
- [ ] Test admin login and rate limiting
- [ ] Verify non-admin users get 404 on `/admin`
- [ ] Test file uploads (valid and malicious filenames)
- [ ] Verify image hostname restrictions
- [ ] Check security headers in browser dev tools
- [ ] Review Supabase storage policies
- [ ] Set up monitoring for `rate_limit_log` table
- [ ] (Optional) Set up cron job to cleanup old rate limit logs
- [ ] (Optional) Enable `admin_audit_log` for compliance

### Environment Variables:

Required:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Never expose:**
- `SUPABASE_SERVICE_ROLE_KEY` (never needed in this app)
- `SUPABASE_JWT_SECRET` (only used by Supabase internally)

## 🛡️ Attack Scenarios & Mitigations

### 1. Unauthorized Event Deletion
**Attack:** Attacker calls `deleteEvent()` with a valid event ID

**Mitigations:**
1. ✅ `verifyAdmin()` check rejects non-admins
2. ✅ RLS policy prevents database deletion
3. ✅ Rate limiting prevents brute force
4. ✅ Audit log records attempts (optional)

### 2. Direct Database Access
**Attack:** Attacker uses anon key to query database directly via Supabase REST API

**Mitigations:**
1. ✅ RLS policies block unauthorized reads/writes
2. ✅ Storage policies block unauthorized file operations
3. ✅ Even with anon key, attacker cannot bypass RLS

### 3. Path Traversal via File Upload
**Attack:** Upload file named `../../../../etc/passwd.jpg`

**Mitigations:**
1. ✅ Extension sanitized to `etcpasswd.jpg`
2. ✅ Stored in namespaced path: `events/12345-abc.etcpasswd`
3. ✅ Supabase storage API prevents directory traversal
4. ✅ Extension whitelist prevents execution

### 4. SSRF via Image Loading
**Attack:** Load image from `https://evil.com/malicious.jpg`

**Mitigations:**
1. ✅ Next.js image hostname restriction
2. ✅ Only `*.supabase.co` allowed
3. ✅ Attempts to load from other domains fail

### 5. Cookie Tampering
**Attack:** Modify JWT cookie to add `admin: true` claim

**Mitigations:**
1. ✅ JWT signature verification fails (signed by Supabase)
2. ✅ Even if signature bypassed, `verifyAdmin()` checks database
3. ✅ RLS policies double-check admin status
4. ✅ Audit log records all admin actions

### 6. Rate Limit Bypass
**Attack:** Spam server actions from multiple IPs

**Mitigations:**
1. ✅ Rate limiting tracks both user ID and IP
2. ✅ Authenticated users are tracked by user ID (can't bypass with IP rotation)
3. ✅ Cleanup prevents log table bloat
4. ✅ RLS policies prevent deleting rate limit logs

## 📊 Monitoring & Auditing

### Rate Limit Monitoring
Query `rate_limit_log` for suspicious activity:
```sql
-- Check for rate limit violations in last hour
SELECT identifier, action, COUNT(*) as attempts
FROM rate_limit_log
WHERE created_at > now() - interval '1 hour'
GROUP BY identifier, action
HAVING COUNT(*) > 50
ORDER BY attempts DESC;
```

### Admin Audit Log (Optional)
If you implement audit logging:
```sql
-- View recent admin actions
SELECT 
  u.email,
  a.action,
  a.table_name,
  a.created_at
FROM admin_audit_log a
LEFT JOIN auth.users u ON u.id = a.user_id
ORDER BY a.created_at DESC
LIMIT 50;
```

## 🔄 Maintenance

### Cleanup Rate Limit Logs
Set up a Supabase cron job:
```sql
-- Delete logs older than 10 minutes
DELETE FROM rate_limit_log
WHERE created_at < now() - interval '10 minutes';
```

### Rotate Admin Access
To revoke admin access:
```sql
-- Remove from admins table
DELETE FROM admins WHERE user_id = 'USER_UUID';
```

## 📞 Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** create a public GitHub issue
2. Email: [security contact - add your email here]
3. Include: description, reproduction steps, impact assessment

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Last Updated:** 2025-10-04
**Security Review:** Comprehensive audit completed

