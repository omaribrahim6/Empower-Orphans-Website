'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getUser, isAdmin } from '@/lib/supabase-server'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

interface EventPayload {
  title: string
  date: string
  location?: string
  description?: string
  link?: string
  chapter?: string
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
 * Upload event image
 */
async function uploadEventImage(file: File): Promise<{ path: string } | null> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed')
  }

  const MAX_SIZE = 25 * 1024 * 1024 // 25MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 25MB')
  }

  const supabase = await createClient()

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  const path = `events/${uniqueName}`

  // Upload
  const { error } = await supabase.storage
    .from('media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Image upload error:', error)
    throw new Error(error.message)
  }

  return { path }
}

/**
 * Delete event image from storage
 */
async function deleteEventImage(path: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.storage.from('media').remove([path])
  
  if (error) {
    console.error('Image delete error:', error)
  }
}

/**
 * Create a new event
 */
export async function createEvent(formData: FormData): Promise<ActionResult<any>> {
  try {
    const { isAdmin: userIsAdmin, userId } = await verifyAdmin()
    if (!userIsAdmin || !userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Extract form data
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const link = formData.get('link') as string
    const chapter = formData.get('chapter') as string
    const file = formData.get('image') as File | null

    // Validate required fields
    if (!title || !date) {
      return { success: false, error: 'Title and event date are required' }
    }

    let image_url: string | undefined

    // Upload image if provided
    if (file && file.size > 0) {
      try {
        const result = await uploadEventImage(file)
        const supabase = await createClient()
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(result.path)
        image_url = urlData.publicUrl
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    }

    // Insert event
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        date,
        location: location || null,
        description: description || null,
        link: link || null,
        chapter: chapter || null,
        image_url,
        created_by: userId,
      })
      .select()
      .single()

    if (error) {
      console.error('Event insert error:', error)
      // Rollback image upload if event creation fails
      if (image_url) {
        const pathMatch = image_url.match(/events\/[^?]+/)
        if (pathMatch) {
          await deleteEventImage(pathMatch[0])
        }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/events')
    revalidatePath('/')

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update an existing event
 */
export async function updateEvent(id: string, formData: FormData): Promise<ActionResult<any>> {
  try {
    const { isAdmin: userIsAdmin } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    // Get existing event
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      return { success: false, error: 'Event not found' }
    }

    // Extract form data
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const link = formData.get('link') as string
    const chapter = formData.get('chapter') as string
    const file = formData.get('image') as File | null

    if (!title || !date) {
      return { success: false, error: 'Title and event date are required' }
    }

    let image_url = existingEvent.image_url

    // Upload new image if provided
    if (file && file.size > 0) {
      try {
        const result = await uploadEventImage(file)
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(result.path)
        image_url = urlData.publicUrl

        // Delete old image
        if (existingEvent.image_url) {
          const oldPathMatch = existingEvent.image_url.match(/events\/[^?]+/)
          if (oldPathMatch) {
            await deleteEventImage(oldPathMatch[0])
          }
        }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    }

    // Update event
    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        date,
        location: location || null,
        description: description || null,
        link: link || null,
        chapter: chapter || null,
        image_url,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Event update error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/events')
    revalidatePath('/')

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const { isAdmin: userIsAdmin } = await verifyAdmin()
    if (!userIsAdmin) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    // Get event to find image
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      return { success: false, error: 'Event not found' }
    }

    // Delete event from database
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Event delete error:', deleteError)
      return { success: false, error: deleteError.message }
    }

    // Delete image if exists
    if (event.image_url) {
      const pathMatch = event.image_url.match(/events\/[^?]+/)
      if (pathMatch) {
        await deleteEventImage(pathMatch[0])
      }
    }

    revalidatePath('/admin')
    revalidatePath('/events')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all events (for admin panel)
 */
export async function getEvents(): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Events fetch error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

