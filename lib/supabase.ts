import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug: Log environment variables (without exposing sensitive data)
console.log('Supabase Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPrefix: supabaseUrl?.substring(0, 20) + '...',
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
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
  position?: number // Vertical position percentage (0-100) for object-position
}

// Server-side function to fetch events
export async function getEvents(): Promise<Event[]> {
  console.log('🔍 Attempting to fetch events...')
  
  if (!supabase) {
    console.error('❌ Supabase client not initialized! Check your environment variables.')
    return []
  }
  
  try {
    console.log('📡 Querying events table...')
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('❌ Supabase error fetching events:')
      console.error('Raw error:', error)
      console.error('Error type:', typeof error)
      console.error('Error keys:', Object.keys(error))
      console.error('Stringified:', JSON.stringify(error, null, 2))
      return []
    }
    
    console.log('✅ Successfully fetched events:', data?.length || 0, 'items')
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error fetching events:', error)
    return []
  }
}

// Server-side function to fetch hero images
export async function getHeroImages(): Promise<HeroImage[]> {
  console.log('🔍 Attempting to fetch hero images...')
  
  if (!supabase) {
    console.error('❌ Supabase client not initialized! Check your environment variables.')
    return []
  }
  
  try {
    console.log('📡 Querying hero_slides table...')
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) {
      console.error('❌ Supabase error fetching hero slides:')
      console.error('Raw error:', error)
      console.error('Error type:', typeof error)
      console.error('Error keys:', Object.keys(error))
      console.error('Stringified:', JSON.stringify(error, null, 2))
      return []
    }
    
    console.log('✅ Successfully fetched hero slides:', data?.length || 0, 'items')
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error fetching hero images:', error)
    return []
  }
}

