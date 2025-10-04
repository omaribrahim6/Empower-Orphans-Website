import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Missing Supabase credentials in middleware')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Create a response to modify cookies
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      })

      // Create Supabase client with cookie handling
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      // Check if user is authenticated
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        // Not authenticated, redirect to login
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // User is authenticated, allow request to proceed
      // Admin role check happens in the page component for security-through-ambiguity
      return response
    } catch (error) {
      console.error('❌ Middleware error:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

