import { notFound, redirect } from 'next/navigation'
import { getUser, isAdmin } from '@/lib/supabase-server'
import AdminDashboard from './AdminDashboard'

// Force dynamic rendering (never cache)
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Get current user
  const user = await getUser()

  if (!user) {
    // Should be caught by middleware, but double-check
    redirect('/admin/login')
  }

  // Verify user is an admin
  const userIsAdmin = await isAdmin(user.id)

  if (!userIsAdmin) {
    // Security through ambiguity: return 404 instead of 403
    console.warn(`⚠️  Unauthorized access attempt to /admin by user: ${user.email} (${user.id})`)
    notFound()
  }

  console.log(`✅ Admin access granted to: ${user.email}`)

  return <AdminDashboard user={user} />
}

