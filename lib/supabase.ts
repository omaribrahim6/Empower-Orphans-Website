import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env'
  )
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Event = {
  id: string
  title: string
  description?: string
  date: string
  image_url?: string
  location?: string
  chapter?: 'carleton' | 'uottawa' | 'both'
  is_past: boolean
  created_at?: string
}

export type HeroImage = {
  id: string
  url: string
  alt?: string
  order?: number
}

// Server-side function to fetch events
export async function getEvents(): Promise<Event[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty events')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

// Server-side function to fetch hero images
export async function getHeroImages(): Promise<HeroImage[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty hero images')
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return []
  }
}

