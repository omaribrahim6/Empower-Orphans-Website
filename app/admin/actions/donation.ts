'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getUser, isAdmin } from '@/lib/supabase-server'
import { isRateLimited } from '@/lib/rate-limit'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

/**
 * Verify the current user is an admin
 */
async function verifyAdmin(): Promise<{ isAdmin: boolean; userId: string | null }> {
  const user = await getUser()
  if (!user) {
    return { isAdmin: false, userId: null }
  }

  const adminStatus = await isAdmin(user.id)
  return { isAdmin: adminStatus, userId: user.id }
}

/**
 * Get current donation progress (Admin only)
 * SECURITY: Requires admin authentication
 */
export async function getDonationProgress(): Promise<ActionResult<{ amount: number }>> {
  try {
    // SECURITY: Verify admin access
    const { isAdmin: userIsAdmin, userId } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    // SECURITY: Rate limit check
    const rateLimitCheck = await isRateLimited('read', userId || undefined)
    if (rateLimitCheck.limited) {
      return { success: false, error: rateLimitCheck.message || 'Rate limit exceeded' }
    }

    const supabase = await createClient()

    // Get the most recent donation progress entry
    const { data, error } = await supabase
      .from('donation_progress')
      .select('amount')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // If no record exists yet, return 0
      if (error.code === 'PGRST116') {
        return { success: true, data: { amount: 0 } }
      }
      console.error('Fetch error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: { amount: data.amount || 0 } }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get current donation progress (Public - no authentication required)
 * This is used on the public-facing website
 */
export async function getPublicDonationProgress(): Promise<number> {
  try {
    const supabase = await createClient()

    // Get the most recent donation progress entry
    const { data, error } = await supabase
      .from('donation_progress')
      .select('amount')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // If no record exists yet, return 0
      if (error.code === 'PGRST116') {
        return 0
      }
      console.error('Public fetch error:', error)
      return 0
    }

    return data.amount || 0
  } catch (error) {
    console.error('Unexpected error:', error)
    return 0
  }
}

/**
 * Update donation progress
 * SECURITY: Requires admin authentication
 */
export async function updateDonationProgress(amount: number): Promise<ActionResult> {
  try {
    // SECURITY: Verify admin access
    const { isAdmin: userIsAdmin, userId } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    // SECURITY: Rate limit check
    const rateLimitCheck = await isRateLimited('write', userId || undefined)
    if (rateLimitCheck.limited) {
      return { success: false, error: rateLimitCheck.message || 'Rate limit exceeded' }
    }

    // Validate amount
    if (typeof amount !== 'number' || amount < 0) {
      return { success: false, error: 'Invalid amount. Must be a positive number.' }
    }

    const supabase = await createClient()

    // Check if a record exists
    const { data: existingData } = await supabase
      .from('donation_progress')
      .select('id')
      .limit(1)
      .single()

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('donation_progress')
        .update({ amount, updated_at: new Date().toISOString() })
        .eq('id', existingData.id)

      if (error) {
        console.error('Update error:', error)
        return { success: false, error: error.message }
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('donation_progress')
        .insert({ amount })

      if (error) {
        console.error('Insert error:', error)
        return { success: false, error: error.message }
      }
    }

    // Revalidate pages that display donation progress
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/donate')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
