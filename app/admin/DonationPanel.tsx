'use client'

import { useState, useEffect } from 'react'
import { useToast, ToastContainer } from '@/components/admin/Toast'
import { getDonationProgress, updateDonationProgress } from './actions/donation'
import { SITE } from '@/lib/config'

export default function DonationPanel() {
  const [amount, setAmount] = useState<string>('')
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, dismissToast } = useToast()

  const goal = SITE.goalThisYear

  // Load current donation progress on mount
  useEffect(() => {
    loadDonationProgress()
  }, [])

  async function loadDonationProgress() {
    setLoading(true)
    const result = await getDonationProgress()
    if (result.success && result.data) {
      setCurrentAmount(result.data.amount)
      setAmount(result.data.amount.toString())
    } else {
      addToast(result.error || 'Failed to load donation progress', 'error')
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const numAmount = parseFloat(amount)

    // Validate
    if (isNaN(numAmount) || numAmount < 0) {
      addToast('Please enter a valid positive number', 'error')
      return
    }

    setSaving(true)

    const result = await updateDonationProgress(numAmount)

    if (result.success) {
      addToast('Donation progress updated successfully!', 'success')
      setCurrentAmount(numAmount)
    } else {
      addToast(result.error || 'Failed to update donation progress', 'error')
    }

    setSaving(false)
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const percentage = Math.max(0, Math.min(100, (currentAmount / goal) * 100))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eo-teal"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Info Banner */}
      <div className="bg-eo-sky/10 border border-eo-teal/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-eo-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-sub text-eo-dark">
              <span className="font-semibold">Temporary Donation Tracker</span>
              <br />
              This allows you to manually set the donation progress amount displayed on the website.
              This is a temporary solution until Stripe integration is complete.
            </p>
          </div>
        </div>
      </div>

      {/* Current Progress Display */}
      <div className="bg-white rounded-xl border-2 border-eo-blue/20 p-6 shadow-lg">
        <h2 className="text-xl font-brand font-bold text-eo-dark mb-6">
          Current Progress
        </h2>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-eo-dark/60 font-medium mb-1">Current Amount</p>
              <p className="text-4xl font-bold text-eo-teal font-brand">
                {formatCurrency(currentAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-eo-dark/60 font-medium mb-1">Goal ({new Date().getFullYear()})</p>
              <p className="text-3xl font-bold text-eo-dark font-brand">
                {formatCurrency(goal)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-4 overflow-hidden rounded-full bg-eo-blue/15">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  background: 'linear-gradient(90deg, #0e869d 0%, #45bfd6 60%, #79d3ff 100%)',
                  boxShadow: '0 4px 16px rgba(14, 134, 157, 0.3)',
                }}
              />
            </div>
          </div>

          {/* Percentage */}
          <div className="flex items-center justify-between text-sm font-sub">
            <span className="text-eo-dark/60">Progress:</span>
            <span className="text-eo-teal font-bold">{Math.floor(percentage)}%</span>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h2 className="text-xl font-brand font-bold text-eo-dark mb-4">
          Update Donation Progress
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-eo-dark mb-2">
              Current Donation Amount (CAD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 font-sub text-lg">$</span>
              </div>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-eo-teal focus:border-eo-teal
                         font-sub text-lg transition-colors"
                placeholder="0.00"
                disabled={saving}
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 font-sub">
              Enter the total amount raised so far. This will be displayed on the homepage and donate page.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-eo-teal hover:bg-eo-dark text-white font-sub font-medium rounded-lg
                       transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Update Progress'}
            </button>
            <button
              type="button"
              onClick={() => setAmount(currentAmount.toString())}
              disabled={saving}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sub font-medium rounded-lg
                       transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Quick Amount Buttons */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-brand font-bold text-eo-dark mb-4">
          Quick Add
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[100, 500, 1000, 5000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => {
                const newAmount = currentAmount + quickAmount
                setAmount(newAmount.toString())
              }}
              disabled={saving}
              className="px-4 py-3 bg-eo-bg/30 hover:bg-eo-teal hover:text-white border-2 border-eo-teal/30
                       text-eo-dark font-sub font-medium rounded-lg transition-all
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eo-sky
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +{formatCurrency(quickAmount)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500 font-sub">
          Click to quickly add these amounts to the current progress
        </p>
      </div>
    </div>
  )
}
