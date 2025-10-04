'use client'

import { useFormStatus } from 'react-dom'
import { loginAction } from './actions'
import { useEffect, useActionState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-eo-teal hover:bg-eo-dark text-white font-brand font-semibold py-3 px-6 rounded-lg 
                 transition-all duration-200 shadow-brand hover:shadow-glow
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-eo-sky focus:ring-offset-2"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.error) {
      // Announce error to screen readers
      const announcement = document.getElementById('error-announcement')
      if (announcement) {
        announcement.textContent = state.error
      }
    }
  }, [state?.error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-eo-bg via-white to-eo-sky/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-brand font-bold text-eo-teal mb-2">
            Empower Orphans
          </h1>
          <p className="text-eo-dark/70 font-sub">Admin Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-brand p-8 animate-slide-up">
          <form action={formAction} className="space-y-6">
            {/* Error Alert */}
            {state?.error && (
              <div
                role="alert"
                aria-live="assertive"
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-scale-in"
              >
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700 font-sub">{state.error}</p>
                </div>
              </div>
            )}

            {/* Screen reader announcement for errors */}
            <div id="error-announcement" className="sr-only" aria-live="polite" />

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-brand font-semibold text-eo-dark mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent
                         font-sub text-eo-dark placeholder-gray-400
                         transition-all duration-200"
                placeholder="admin@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-brand font-semibold text-eo-dark mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-eo-teal focus:border-transparent
                         font-sub text-eo-dark placeholder-gray-400
                         transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <SubmitButton />

            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center mt-4 font-sub">
              This is a protected area. Login attempts are rate-limited for security.
            </p>
          </form>
        </div>

        {/* Back to Site Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-eo-teal hover:text-eo-dark font-sub transition-colors
                     focus:outline-none focus:underline"
          >
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  )
}

