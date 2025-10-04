'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getUser, isAdmin } from '@/lib/supabase-server'

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
 * Upload a carousel image
 */
export async function uploadCarouselImage(formData: FormData): Promise<ActionResult<{ path: string }>> {
  try {
    const { isAdmin: userIsAdmin } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Only image files are allowed' }
    }

    // Validate file size (25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024 // 25MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'File size must be less than 25MB' }
    }

    const supabase = await createClient()

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const path = `carousel/${uniqueName}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(path)

    // Get current max order
    const { data: maxData } = await supabase
      .from('hero_slides')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxData?.order ?? -1) + 1

    // Add to hero_slides table
    const { error: dbError } = await supabase
      .from('hero_slides')
      .insert({
        url: urlData.publicUrl,
        order: nextOrder,
      })

    if (dbError) {
      // Rollback: delete uploaded file
      await supabase.storage.from('media').remove([path])
      console.error('DB error:', dbError)
      return { success: false, error: dbError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true, data: { path } }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete a carousel image
 */
export async function deleteCarouselImage(id: string, url: string): Promise<ActionResult> {
  try {
    const { isAdmin: userIsAdmin } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    // Delete from database
    const { error: dbError } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('DB delete error:', dbError)
      return { success: false, error: dbError.message }
    }

    // Extract path from URL and delete from storage
    const pathMatch = url.match(/carousel\/[^?]+/)
    if (pathMatch) {
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([pathMatch[0]])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        // Continue anyway - DB record is already deleted
      }
    }

    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Reorder carousel images
 */
export async function reorderCarouselImages(order: { id: string; order: number }[]): Promise<ActionResult> {
  try {
    const { isAdmin: userIsAdmin } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    // Update each item's order
    const updates = order.map(({ id, order: orderValue }) =>
      supabase
        .from('hero_slides')
        .update({ order: orderValue })
        .eq('id', id)
    )

    await Promise.all(updates)

    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all carousel images
 */
export async function getCarouselImages(): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Fetch error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

