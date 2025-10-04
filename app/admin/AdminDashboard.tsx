'use client'

import { useState, Suspense, lazy } from 'react'
import { Tabs } from '@/components/admin/Tabs'
import { logoutAction } from './login/actions'
import type { User } from '@supabase/supabase-js'

// Lazy load heavy panels for code splitting
const CarouselPanel = lazy(() => import('./CarouselPanel'))
const EventsPanel = lazy(() => import('./EventsPanel'))

interface AdminDashboardProps {
  user: User
}

function PanelLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eo-teal"></div>
    </div>
  )
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('carousel')

  const tabs = [
    {
      id: 'carousel',
      label: 'Carousel',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'events',
      label: 'Events',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-eo-bg/30 via-white to-eo-sky/20">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-eo-teal to-eo-blue shadow-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-white/90 hover:text-white font-sub text-sm transition-colors
                       focus:outline-none focus:underline flex items-center gap-1"
              title="Return to main site"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Site
            </a>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-2xl font-brand font-bold text-white">
              Empower Orphans Admin
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-sub text-white/90">{user.email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-sub font-medium rounded-lg
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-eo-teal"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-brand overflow-hidden">
          {/* Tabs */}
          <div className="px-6 pt-6">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Panel Content */}
          <div className="p-6">
            <Suspense fallback={<PanelLoading />}>
              {activeTab === 'carousel' && <CarouselPanel />}
              {activeTab === 'events' && <EventsPanel />}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

