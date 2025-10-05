/**
 * Server-side rate limiting utilities
 * Protects server actions from abuse
 */

import { headers } from 'next/headers'
import crypto from 'crypto'
import { createClient } from './supabase-server'

/**
 * Hash an IP address for privacy (SHA-256)
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

/**
 * Get client IP from request headers
 */
export async function getClientIP(): Promise<string> {
  const headersList = await headers()
  
  // Try various headers (CloudFlare, Vercel, standard proxies)
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const cfConnectingIP = headersList.get('cf-connecting-ip')
  
  const ip = cfConnectingIP || realIP || forwardedFor?.split(',')[0] || '0.0.0.0'
  return ip.trim()
}

/**
 * Rate limit configuration for different action types
 */
interface RateLimitConfig {
  maxAttempts: number
  windowMinutes: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Write operations (create, update, delete)
  write: {
    maxAttempts: 30, // 30 write operations
    windowMinutes: 10, // per 10 minutes
  },
  // Read operations
  read: {
    maxAttempts: 100, // 100 read operations
    windowMinutes: 10, // per 10 minutes
  },
  // File uploads
  upload: {
    maxAttempts: 10, // 10 uploads
    windowMinutes: 10, // per 10 minutes
  },
}

/**
 * Check if an action is rate limited
 * Returns true if rate limit is exceeded
 */
export async function isRateLimited(
  actionType: 'write' | 'read' | 'upload',
  userId?: string
): Promise<{ limited: boolean; message?: string }> {
  try {
    const config = RATE_LIMITS[actionType]
    const supabase = await createClient()
    
    // Get client IP
    const clientIP = await getClientIP()
    const ipHash = hashIP(clientIP)
    
    // Create identifier (use userId if authenticated, otherwise IP)
    const identifier = userId || ipHash
    const action = actionType
    
    // Cleanup old attempts
    const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000).toISOString()
    
    await supabase
      .from('rate_limit_log')
      .delete()
      .lt('created_at', windowStart)
    
    // Count recent attempts
    const { count, error } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', windowStart)
    
    if (error) {
      console.error('Error checking rate limit:', error)
      // Fail open (don't block on error, but log it)
      return { limited: false }
    }
    
    if ((count ?? 0) >= config.maxAttempts) {
      console.warn(`⚠️  Rate limit exceeded for ${actionType}: ${identifier.substring(0, 8)}...`)
      return { 
        limited: true, 
        message: `Too many ${actionType} requests. Please try again in ${config.windowMinutes} minutes.` 
      }
    }
    
    // Record this attempt
    await supabase
      .from('rate_limit_log')
      .insert({ 
        identifier, 
        action,
        ip_hash: ipHash,
      })
    
    return { limited: false }
  } catch (error) {
    console.error('Unexpected error in rate limiting:', error)
    // Fail open on unexpected errors
    return { limited: false }
  }
}

/**
 * Decorator function to add rate limiting to server actions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  actionType: 'write' | 'read' | 'upload',
  fn: T
): T {
  return (async (...args: any[]) => {
    // Check rate limit
    const { limited, message } = await isRateLimited(actionType)
    
    if (limited) {
      return { 
        success: false, 
        error: message || 'Rate limit exceeded' 
      }
    }
    
    // Execute the original function
    return fn(...args)
  }) as T
}

