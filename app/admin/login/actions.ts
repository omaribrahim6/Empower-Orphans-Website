'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import crypto from 'crypto'

type LoginResult = {
  success: boolean
  error?: string
}

/**
 * Hash an IP address for privacy (SHA-256)
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

/**
 * Get client IP from request headers
 */
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  
  // Try various headers (CloudFlare, Vercel, standard proxies)
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const cfConnectingIP = headersList.get('cf-connecting-ip')
  
  const ip = cfConnectingIP || realIP || forwardedFor?.split(',')[0] || '0.0.0.0'
  return ip.trim()
}

/**
 * Check rate limiting for login attempts
 * Returns true if rate limit exceeded
 */
async function isRateLimited(ipHash: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Cleanup old attempts first (older than 10 minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  
  // Note: This cleanup is best-effort; a cron job should handle regular cleanup
  await supabase
    .from('login_attempts')
    .delete()
    .lt('created_at', tenMinutesAgo)
  
  // Count recent attempts
  const { count, error } = await supabase
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', tenMinutesAgo)
  
  if (error) {
    console.error('Error checking rate limit:', error)
    // Fail open (don't block on error, but log it)
    return false
  }
  
  return (count ?? 0) >= 5
}

/**
 * Record a login attempt
 */
async function recordLoginAttempt(ipHash: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('login_attempts')
    .insert({ ip_hash: ipHash })
  
  if (error) {
    console.error('Error recording login attempt:', error)
  }
}

/**
 * Login action with rate limiting
 */
export async function loginAction(
  prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      }
    }
    
    // Get and hash IP
    const clientIP = await getClientIP()
    const ipHash = hashIP(clientIP)
    
    // Check rate limiting
    const rateLimited = await isRateLimited(ipHash)
    if (rateLimited) {
      console.warn(`⚠️  Rate limit exceeded for IP hash: ${ipHash.substring(0, 8)}...`)
      return {
        success: false,
        error: 'Too many login attempts. Please try again in 10 minutes.',
      }
    }
    
    // Record this attempt
    await recordLoginAttempt(ipHash)
    
    // Attempt sign in
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Login error:', error.message)
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }
    
    if (!data.user) {
      return {
        success: false,
        error: 'Authentication failed',
      }
    }
    
    // Success - user is authenticated
    // The middleware will handle the redirect
    console.log('✅ User logged in:', data.user.email)
    
  } catch (error) {
    console.error('Unexpected login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
  
  // Redirect to admin dashboard
  redirect('/admin')
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

